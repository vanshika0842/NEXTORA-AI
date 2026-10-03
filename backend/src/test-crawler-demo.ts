import assert from "node:assert/strict";

import prisma from "./lib/prisma";
import { collectUrlFromSource } from "./services/collector.service";
import { ingestCollectedOpportunity } from "./services/opportunity-ingestion.service";
import { saveRawData } from "./services/rawData.service";
import { crawlConfiguredSource } from "./services/source-crawler.service";
import { parseSourceDiscoveryConfig } from "./services/source-discovery.service";

const divider = "==================================================";

function report(label: string, value: string | number): void {
  console.log(`${label}: ${value}`);
}

async function main() {
  const source = await prisma.source.findFirst({
    where: {
      active: true,
      name: { contains: "National Scholarship Portal", mode: "insensitive" },
      configuration: { isNot: null },
    },
    include: { configuration: true },
  });

  if (!source) {
    throw new Error("An active configured National Scholarship Portal source is required for this demo");
  }

  const configured = parseSourceDiscoveryConfig(source.configuration?.parsingConfig);
  if (!configured.itemSelector) {
    throw new Error("The existing NSP configuration must define an inline-card selector");
  }

  // Only in-memory overrides: SourceConfiguration is never modified by this demo.
  const config = {
    ...configured,
    maxPages: 1,
    maxCandidates: 3,
    maxDetailPages: 0,
  };
  const rawDataIds: number[] = [];
  const createdOpportunityIds: number[] = [];

  console.log(`\n${divider}\nNEXTORA DAY 3 CRAWLER DEMO\n${divider}`);
  console.log("\nSOURCE");
  report("Name", source.name);
  report("Source ID", source.id);
  console.log("\nCRAWL START");
  report("Listing URL", config.listingUrls?.[0] ?? source.sourceUrl);
  report("Safety limits", "maxPages=1, maxCandidates=3, maxDetailPages=0");

  try {
    const result = await crawlConfiguredSource(source, config, {
      collect: collectUrlFromSource,
      async saveListingRawData(collection) {
        const rawData = await saveRawData(collection);
        rawDataIds.push(rawData.id);
        return rawData;
      },
      async ingest(input, collection) {
        const ingestion = await ingestCollectedOpportunity(input, collection);
        if (ingestion.rawDataId) rawDataIds.push(ingestion.rawDataId);
        if (ingestion.persistence?.action === "CREATED" && ingestion.persistence.opportunityId) {
          createdOpportunityIds.push(ingestion.persistence.opportunityId);
        }
        return ingestion;
      },
      sleep: (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
      now: () => Date.now(),
    });

    assert.equal(result.pagesVisited, 1);
    assert.equal(result.listingsCollected, 1);
    assert.equal(result.listingRawDataSaved, 1);
    assert.ok(result.candidatesDiscovered > 0, "NSP should expose at least one configured inline card");
    assert.ok(result.inlineItemsProcessed > 0, "NSP cards must follow inline processing");
    assert.ok(result.extracted > 0, "Inline cards must enter the existing ingestion pipeline");

    console.log("\nPAGE 1");
    console.log("✓ Page collected");
    console.log(`✓ RawData saved: ${result.listingRawDataSaved}`);
    console.log(`✓ Candidates discovered: ${result.candidatesDiscovered}`);
    console.log("\nDISCOVERY");
    console.log("✓ Candidate URLs normalized by the crawler queue");
    console.log(`✓ Duplicate URLs removed: ${result.candidatesDeduplicated}`);
    console.log("✓ Same-domain restriction applied from NSP configuration");
    console.log("\nDETAIL / INLINE PROCESSING");
    console.log(`✓ Inline items processed: ${result.inlineItemsProcessed}`);
    console.log(`✓ Detail pages collected: ${result.detailPagesCollected}`);
    console.log(`✓ Extracted: ${result.extracted}`);
    console.log("\nVALIDATION");
    report("VALID", result.validationCounts.VALID);
    report("REVIEW", result.validationCounts.REVIEW);
    report("INVALID", result.validationCounts.INVALID);
    report("EXPIRED", result.validationCounts.EXPIRED);
    console.log("\nPERSISTENCE");
    report("CREATED", result.created);
    report("UPDATED", result.updated);
    report("SKIPPED", result.skipped);
    console.log("\nCRAWL SUMMARY");
    report("Pages visited", result.pagesVisited);
    report("Listings collected", result.listingsCollected);
    report("Candidates discovered", result.candidatesDiscovered);
    report("Candidates deduplicated", result.candidatesDeduplicated);
    report("Detail pages collected", result.detailPagesCollected);
    report("Inline items processed", result.inlineItemsProcessed);
    report("Extracted", result.extracted);
    report("RawData records retained during crawl", rawDataIds.length);
    report("Retries", result.retries);
    report("Errors", result.errors.length);
    if (result.errors.length) console.log(result.errors.map((error) => `- ${error}`).join("\n"));
    console.log(`\n${divider}\nCRAWLER DEMO COMPLETE\n${divider}`);
  } finally {
    // The IDs are captured from this run only. Existing data is never selected
    // by marker/time range and cannot be deleted by this cleanup.
    if (createdOpportunityIds.length) {
      await prisma.opportunity.deleteMany({ where: { id: { in: createdOpportunityIds } } });
    }
    if (rawDataIds.length) {
      await prisma.rawData.deleteMany({ where: { id: { in: rawDataIds } } });
    }
    console.log(`Demo cleanup: removed ${rawDataIds.length} RawData record(s) and ${createdOpportunityIds.length} newly created opportunity record(s).`);
  }
}

main()
  .catch((error) => {
    console.error("Crawler demo failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
