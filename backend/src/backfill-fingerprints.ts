import prisma from "./lib/prisma";
import {
  generateOpportunityFingerprint,
} from "./services/opportunity-fingerprint.service";

async function main() {
  console.log("Starting fingerprint backfill...\n");

  const opportunities = await prisma.opportunity.findMany({
    where: {
      fingerprint: null,
    },
  });

  console.log(
    `Found ${opportunities.length} opportunities without fingerprints.\n`
  );

  let updated = 0;
  let skipped = 0;

  for (const opportunity of opportunities) {
    if (!opportunity.sourceUrl) {
      skipped++;
      console.error(
        `Skipped #${opportunity.id}: sourceUrl is required to fingerprint ${opportunity.title}`
      );
      continue;
    }

    const fingerprint = generateOpportunityFingerprint({
      title: opportunity.title,
      organization: opportunity.organization,
      type: opportunity.type,
      description: opportunity.description,
      location: opportunity.location,
      applicationStartDate:
        opportunity.applicationStartDate,
      applicationDeadline:
        opportunity.applicationDeadline,
      officialUrl: opportunity.officialUrl,
      applicationUrl: opportunity.applicationUrl,
      isRemote: opportunity.isRemote,
      sourceName: opportunity.sourceName,
      sourceUrl: opportunity.sourceUrl,
      normalizedAt: new Date(),
    });

    try {
      await prisma.opportunity.update({
        where: {
          id: opportunity.id,
        },
        data: {
          fingerprint,
        },
      });

      updated++;

      console.log(
        `Updated #${opportunity.id}: ${opportunity.title}`
      );
    } catch (error) {
      skipped++;

      console.error(
        `Skipped #${opportunity.id}: ${opportunity.title}`,
        error
      );
    }
  }

  console.log("\n==============================");
  console.log("BACKFILL COMPLETE");
  console.log("==============================");
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
}

main()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
