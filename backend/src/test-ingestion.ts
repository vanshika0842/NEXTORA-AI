import assert from "node:assert/strict";

import prisma from "./lib/prisma";
import { ingestSource } from "./services/opportunity-ingestion.service";

async function main() {
  const source = await prisma.source.findFirst({
    where: {
      active: true,
      collectionMethod: "WEBSITE",
      configuration: { isNot: null },
    },
    orderBy: { id: "asc" },
  });

  if (!source) {
    throw new Error("No active WEBSITE source with configuration is available for ingestion testing");
  }

  console.log(`Running full ingestion for source ${source.id}: ${source.name}`);

  const first = await ingestSource(source.id);
  assert.equal(first.collection.success, true);
  assert.ok(first.rawDataId, "A successful collection must create RawData");
  assert.equal(first.error, undefined);

  console.dir(first, { depth: null });

  if (first.validation?.status !== "VALID") {
    console.log(`Source output was safely not persisted: ${first.validation?.status ?? "EXTRACTION_FAILED"}`);
    return;
  }

  assert.equal(first.persistence?.success, true);
  assert.ok(first.fingerprint);

  const second = await ingestSource(source.id);
  assert.equal(second.collection.success, true);
  assert.equal(second.validation?.status, "VALID");
  assert.equal(second.persistence?.action, "UPDATED");

  const count = await prisma.opportunity.count({
    where: { fingerprint: first.fingerprint },
  });

  assert.equal(count, 1);
  console.log("Full pipeline duplicate assertion passed: second run UPDATED, database count is 1.");
}

main()
  .catch((error) => {
    console.error("Ingestion test failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
