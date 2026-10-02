import { createHash } from "crypto";

import type { NormalizedOpportunity } from "./opportunity-normalization.service";

// --------------------------------------------------
// STRING NORMALIZATION
// --------------------------------------------------

function normalize(value: string | null): string {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

// --------------------------------------------------
// URL NORMALIZATION
// --------------------------------------------------

function normalizeUrl(value: string | null): string {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value.trim());

    // Remove URL fragment
    url.hash = "";

    // Remove common tracking parameters
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
    ];

    for (const param of trackingParams) {
      url.searchParams.delete(param);
    }

    // Remove trailing slash
    return url
      .toString()
      .replace(/\/$/, "")
      .toLowerCase();
  } catch {
    return normalize(value);
  }
}

// --------------------------------------------------
// FINGERPRINT GENERATION
// --------------------------------------------------

export function generateOpportunityFingerprint(
  opportunity: NormalizedOpportunity
): string {
  /*
   * Identity fields:
   *
   * organization
   * title
   * opportunity type
   * canonical URL
   *
   * Deadline is intentionally NOT included.
   *
   * A deadline can change.
   * If the deadline changes, we want to UPDATE
   * the existing opportunity rather than create
   * a duplicate.
   */

  const canonicalUrl =
    opportunity.officialUrl ||
    opportunity.applicationUrl ||
    opportunity.sourceUrl;

  const identity = [
    normalize(opportunity.organization),
    normalize(opportunity.title),
    opportunity.type ?? "",
    normalizeUrl(canonicalUrl),
  ].join("|");

  return createHash("sha256")
    .update(identity)
    .digest("hex");
}