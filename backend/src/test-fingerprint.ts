import {
  generateOpportunityFingerprint,
} from "./services/opportunity-fingerprint.service";

import assert from "node:assert/strict";

import type { NormalizedOpportunity } from "./services/opportunity-normalization.service";

const createOpportunity = (
  overrides: Partial<NormalizedOpportunity> = {}
): NormalizedOpportunity => ({
  title: "Software Engineering Internship",
  organization: "Google",
  type: "INTERNSHIP",

  description:
    "Software engineering internship for students.",

  officialUrl:
    "https://careers.google.com/internships/",

  applicationUrl:
    "https://careers.google.com/apply",

  location: "India",

  isRemote: false,

  applicationStartDate:
    new Date("2026-10-01"),

  applicationDeadline:
    new Date("2026-12-31"),

  sourceName:
    "Google Careers",

  sourceUrl:
    "https://careers.google.com",

  normalizedAt:
    new Date(),

  ...overrides,
});

// ==================================================
// OPPORTUNITY 1
// ==================================================

const opportunity1 = createOpportunity();

// ==================================================
// OPPORTUNITY 2
// Same opportunity, formatting differences
// ==================================================

const opportunity2 = createOpportunity({
  title: "  Software   Engineering Internship  ",

  organization: " GOOGLE ",

  officialUrl:
    "https://careers.google.com/internships/#apply",
});

// ==================================================
// OPPORTUNITY 3
// Different opportunity
// ==================================================

const opportunity3 = createOpportunity({
  title: "Machine Learning Internship",
});

// ==================================================
// GENERATE FINGERPRINTS
// ==================================================

const fingerprint1 =
  generateOpportunityFingerprint(opportunity1);

const fingerprint2 =
  generateOpportunityFingerprint(opportunity2);

const fingerprint3 =
  generateOpportunityFingerprint(opportunity3);

const fingerprintWithChangedDeadline =
  generateOpportunityFingerprint(
    createOpportunity({
      applicationDeadline: new Date("2027-01-31"),
    })
  );

// ==================================================
// OUTPUT
// ==================================================

console.log("\n==============================");
console.log("FINGERPRINT 1");
console.log("==============================");
console.log(fingerprint1);

console.log("\n==============================");
console.log("FINGERPRINT 2");
console.log("==============================");
console.log(fingerprint2);

console.log("\n==============================");
console.log("FINGERPRINT 3");
console.log("==============================");
console.log(fingerprint3);

console.log("\n==============================");
console.log("DUPLICATE TEST");
console.log("==============================");

console.log(
  "Opportunity 1 === Opportunity 2:",
  fingerprint1 === fingerprint2
);

console.log(
  "Opportunity 1 === Opportunity 3:",
  fingerprint1 === fingerprint3
);

assert.equal(fingerprint1, fingerprint2);
assert.equal(fingerprint1, fingerprintWithChangedDeadline);
assert.notEqual(fingerprint1, fingerprint3);

console.log("Fingerprint assertions passed.");
