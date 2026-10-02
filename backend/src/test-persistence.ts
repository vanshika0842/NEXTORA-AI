import prisma from "./lib/prisma";
import { normalizeOpportunity } from "./services/opportunity-normalization.service";
import { validateOpportunity } from "./services/opportunity-validator.service";
import {
  calculateOpportunityStatus,
  persistOpportunity,
} from "./opportunity-persistence.service";
import { OpportunityStatus } from "./generated/prisma/client";

async function main() {
  const runId = Date.now();
  const title = `Nextora Persistence Test ${runId}`;
  const now = new Date();

  assertStatusCalculations(now);

  const opportunity = normalizeOpportunity({
    title,
    organization: "Nextora Technologies",
    type: "INTERNSHIP",

    description:
      "Test internship used to verify persistence and duplicate detection.",

    eligibility: "Students enrolled in an accredited degree program.",

    officialUrl:
      `https://example.com/internship/${runId}`,

    applicationUrl:
      `https://example.com/apply/${runId}`,

    location: "Remote",
    isRemote: true,

    applicationStartDate: "2026-10-03",
    applicationDeadline: "2026-12-31",

    sourceName: "Nextora Test Source",
    sourceUrl: "https://example.com",

    confidence: 1,

  });

  console.log("\n==============================");
  console.log("VALIDATION");
  console.log("==============================");

  const validation = validateOpportunity(opportunity);

  console.log(validation);

  console.log("\n==============================");
  console.log("FIRST INSERT");
  console.log("==============================");

  const firstResult = await persistOpportunity(
    opportunity,
    validation
  );

  console.log(firstResult);

  console.log("\n==============================");
  console.log("SECOND INSERT");
  console.log("==============================");

  const secondResult = await persistOpportunity(
    opportunity,
    validation
  );

  console.log(secondResult);

  console.log("\n==============================");
  console.log("DATABASE CHECK");
  console.log("==============================");

  const records = await prisma.opportunity.findMany({
    where: {
      title,
    },

    select: {
      id: true,
      title: true,
      organization: true,
      type: true,
      fingerprint: true,
      officialUrl: true,
      applicationUrl: true,
      sourceName: true,
      sourceUrl: true,
      status: true,
      isRemote: true,
    },
  });

  console.log("Matching opportunities:", records.length);
  console.dir(records, { depth: null });

  if (firstResult.action !== "CREATED") {
    throw new Error(`Expected first persistence action CREATED, got ${firstResult.action}`);
  }

  if (secondResult.action !== "UPDATED") {
    throw new Error(`Expected second persistence action UPDATED, got ${secondResult.action}`);
  }

  if (records.length !== 1) {
    throw new Error(`Expected one persisted opportunity, found ${records.length}`);
  }

  await prisma.opportunity.delete({
    where: { id: firstResult.opportunityId },
  });

  console.log("Temporary persistence test record removed.");

  await prisma.$disconnect();
}

function assertStatusCalculations(now: Date) {
  const oneDay = 24 * 60 * 60 * 1000;

  if (
    calculateOpportunityStatus(new Date(now.getTime() + oneDay), null) !==
    OpportunityStatus.UPCOMING
  ) {
    throw new Error("Expected future application start date to be UPCOMING");
  }

  if (
    calculateOpportunityStatus(null, new Date(now.getTime() + 8 * oneDay)) !==
    OpportunityStatus.OPEN
  ) {
    throw new Error("Expected a deadline beyond seven days to be OPEN");
  }

  if (
    calculateOpportunityStatus(null, new Date(now.getTime() + oneDay)) !==
    OpportunityStatus.CLOSING_SOON
  ) {
    throw new Error("Expected a deadline within seven days to be CLOSING_SOON");
  }

  if (
    calculateOpportunityStatus(null, new Date(now.getFullYear(), now.getMonth(), now.getDate())) !==
    OpportunityStatus.CLOSING_SOON
  ) {
    throw new Error("Expected a deadline on the current day to be CLOSING_SOON");
  }

  if (
    calculateOpportunityStatus(null, new Date(now.getTime() - oneDay)) !==
    OpportunityStatus.CLOSED
  ) {
    throw new Error("Expected a past deadline to be CLOSED");
  }
}

main().catch(async (error) => {
  console.error("Persistence test failed:");
  console.error(error);

  await prisma.$disconnect();

  process.exit(1);
});
