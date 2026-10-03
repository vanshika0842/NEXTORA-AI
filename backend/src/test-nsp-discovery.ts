import assert from "node:assert/strict";

import prisma from "./lib/prisma";
import { updateSourceDiscoveryConfiguration } from "./services/sourceConfiguration.service";
import { crawlSource } from "./services/source-crawler.service";

async function main() {
  const source = await prisma.source.findFirst({
    where: {
      active: true,
      name: { contains: "National Scholarship Portal", mode: "insensitive" },
    },
    select: { id: true, name: true },
  });

  if (!source) {
    throw new Error("The National Scholarship Portal source is not available");
  }

  await updateSourceDiscoveryConfiguration(source.id, {
    listingUrls: ["https://scholarships.gov.in/All-Scholarships"],
    itemSelector: ".accordion-body .row.mb-4.border-1.border-bottom",
    itemDetailLinkText: "specifications",
    allowedDomains: ["scholarships.gov.in"],
    maxPages: 1,
    maxCandidates: 3,
  });

  const result = await crawlSource(source.id);
  console.dir(result, { depth: null });

  assert.equal(result.listingsCollected, 1);
  assert.equal(result.listingRawDataSaved, 1);
  assert.ok(result.candidatesDiscovered > 0);
  assert.ok(result.inlineItemsProcessed > 0);
  assert.ok(result.extracted > 0);
  assert.equal(result.detailPagesCollected, 0);
}

main()
  .catch((error) => {
    console.error("NSP discovery test failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
