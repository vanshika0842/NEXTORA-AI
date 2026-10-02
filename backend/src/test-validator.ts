import {
  validateOpportunity,
} from "./services/opportunity-validator.service";

import assert from "node:assert/strict";

import type { NormalizedOpportunity } from "./services/opportunity-normalization.service";
import type { OpportunityType } from "./generated/prisma/client";

const createOpportunity = (
  overrides: Partial<NormalizedOpportunity> = {}
): NormalizedOpportunity => ({
  title: "Nextora Test Internship",
  organization: "Nextora Technologies",
  type: "INTERNSHIP" as OpportunityType,

  description:
    "Software engineering internship for students.",

  officialUrl:
    "https://example.com/internship",

  applicationUrl:
    "https://example.com/apply",

  location: "India",

  isRemote: true,

  applicationStartDate:
    new Date("2026-10-01"),

  applicationDeadline:
    new Date("2026-12-31"),

  sourceName:
    "National Scholarship Portal",

  sourceUrl:
    "https://example.com",

  normalizedAt:
    new Date(),

  ...overrides,
});

// ==================================================
// 1. VALID FUTURE OPPORTUNITY
// ==================================================

console.log("==============================");
console.log("VALID FUTURE opportunity");
console.log("==============================");

const validOpportunity = createOpportunity();

console.log(
  validateOpportunity(validOpportunity)
);

// ==================================================
// 2. INVALID DATE ORDER
// ==================================================

console.log("\n==============================");
console.log("INVALID DATE ORDER");
console.log("==============================");

const invalidDateOrder = createOpportunity({
  applicationStartDate:
    new Date("2026-12-31"),

  applicationDeadline:
    new Date("2026-10-01"),
});

console.log(
  validateOpportunity(invalidDateOrder)
);

// ==================================================
// 3. INVALID URL
// ==================================================

console.log("\n==============================");
console.log("INVALID URL");
console.log("==============================");

const invalidUrl = createOpportunity({
  sourceUrl: "not-a-valid-url",
});

console.log(
  validateOpportunity(invalidUrl)
);

// ==================================================
// 4. MISSING REQUIRED DATA
// ==================================================

console.log("\n==============================");
console.log("MISSING REQUIRED DATA");
console.log("==============================");

const missingRequiredData = createOpportunity({
  title: "",
  organization: null,
  type: null,
  sourceUrl: "",
});

console.log(
  validateOpportunity(missingRequiredData)
);

// ==================================================
// 5. STARTED BUT STILL OPEN
// ==================================================

console.log("\n==============================");
console.log("STARTED BUT STILL OPEN");
console.log("==============================");

const startedButOpen = createOpportunity({
  applicationStartDate:
    new Date("2026-01-01"),

  applicationDeadline:
    new Date("2026-12-31"),
});

console.log(
  validateOpportunity(startedButOpen)
);

// ==================================================
// 6. EXPIRED OPPORTUNITY
// ==================================================

console.log("\n==============================");
console.log("EXPIRED opportunity");
console.log("==============================");

const expiredOpportunity = createOpportunity({
  applicationStartDate:
    new Date("2025-01-01"),

  applicationDeadline:
    new Date("2025-12-31"),
});

console.log(
  validateOpportunity(expiredOpportunity)
);

const reviewOpportunity = createOpportunity({
  applicationStartDate: null,
});

assert.equal(validateOpportunity(validOpportunity).status, "VALID");
assert.equal(validateOpportunity(invalidDateOrder).status, "INVALID");
assert.equal(validateOpportunity(invalidUrl).status, "INVALID");
assert.equal(validateOpportunity(missingRequiredData).status, "INVALID");
assert.equal(validateOpportunity(startedButOpen).status, "VALID");
assert.equal(validateOpportunity(expiredOpportunity).status, "EXPIRED");
assert.equal(validateOpportunity(reviewOpportunity).status, "REVIEW");

console.log("Validator assertions passed.");
