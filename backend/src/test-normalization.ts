import prisma from "./lib/prisma";
import { collectFromSource } from "./services/collector.service";
import { extractOpportunityFromCollection } from "./services/opportunity-extraction.service";
import { normalizeOpportunity } from "./services/opportunity-normalization.service";

async function main() {
  const sourceId = 2;

  console.log("Starting normalization test...");
  console.log(`Source ID: ${sourceId}`);

  const source = await prisma.source.findUnique({
    where: {
      id: sourceId,
    },
  });

  if (!source) {
    throw new Error(
      `Source ${sourceId} not found`
    );
  }

  console.log(`Source: ${source.name}`);
  console.log(`URL: ${source.sourceUrl}`);

  console.log("\n1. Collecting...");

  const collectionResult =
    await collectFromSource(sourceId);

  if (!collectionResult.success) {
    throw new Error(
      collectionResult.error ??
        "Collection failed"
    );
  }

  console.log("Collection successful.");

  console.log("\n2. Extracting...");

  const extracted =
    extractOpportunityFromCollection(
      collectionResult,
      source.sourceUrl,
      source.name
    );

  console.log("Extraction successful.");

  console.log("\n3. Normalizing...");

  const normalized =
    normalizeOpportunity(extracted);

  console.log("\nNormalized opportunity:");

  console.dir(normalized, {
    depth: null,
  });
}

main()
  .catch((error) => {
    console.error(
      "\nNormalization test failed:"
    );

    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });