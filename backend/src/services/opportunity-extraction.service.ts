import { extractOpportunity } from "../extractors/opportunity.extractor";
import type { CollectionResult } from "../collectors/collector.types";
import type { ExtractedOpportunity } from "../extractors/extractor.types";

export const extractOpportunityFromCollection = (
  result: CollectionResult,
  sourceUrl: string,
  sourceName?: string | null
): ExtractedOpportunity => {
  if (!result.success) {
    throw new Error(
      result.error ?? "Collection failed"
    );
  }

  if (!result.content) {
    throw new Error(
      "Collection succeeded but no content was returned"
    );
  }

  return extractOpportunity({
    html: result.content,
    sourceUrl,
    sourceName,
  });
};