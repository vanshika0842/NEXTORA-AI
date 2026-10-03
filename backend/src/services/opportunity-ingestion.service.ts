import prisma from "../lib/prisma";

import type { CollectionResult } from "../collectors/collector.types";
import type { ExtractedOpportunity } from "../extractors/extractor.types";
import type { PersistenceResult } from "../opportunity-persistence.service";
import type { ValidationResult } from "./opportunity-validator.service";

import { persistOpportunity } from "../opportunity-persistence.service";
import { collectFromSource } from "./collector.service";
import { extractOpportunityFromCollection } from "./opportunity-extraction.service";
import { generateOpportunityFingerprint } from "./opportunity-fingerprint.service";
import { normalizeOpportunity } from "./opportunity-normalization.service";
import { saveRawData } from "./rawData.service";
import { validateOpportunity } from "./opportunity-validator.service";

export interface OpportunityIngestionInput {
  sourceId: number;
  sourceName: string;
  sourceUrl: string;
  officialUrl?: string | null;
}

export interface IngestionResult {
  sourceId: number;
  collection: Pick<CollectionResult, "success" | "statusCode" | "contentType" | "error">;
  rawDataId?: number;
  extracted?: ExtractedOpportunity;
  validation?: ValidationResult;
  fingerprint?: string;
  persistence?: PersistenceResult;
  error?: string;
}

function isHtmlContent(result: CollectionResult): boolean {
  if (!result.contentType) {
    return true;
  }

  const contentType = result.contentType.toLowerCase();
  return contentType.includes("text/html") || contentType.includes("application/xhtml+xml");
}

function collectionSummary(result: CollectionResult): IngestionResult["collection"] {
  return {
    success: result.success,
    statusCode: result.statusCode,
    contentType: result.contentType,
    error: result.error,
  };
}

/**
 * Runs the canonical Day 2 stages for already-collected opportunity content.
 * Discovery uses this entry point for both detail pages and inline listing cards.
 */
export async function ingestCollectedOpportunity(
  input: OpportunityIngestionInput,
  collection: CollectionResult
): Promise<IngestionResult> {
  const summary = collectionSummary(collection);

  if (!collection.success || !collection.content) {
    const error = collection.error ?? "Collection failed or returned no content";
    console.error(`[ingestion] Source ${input.sourceId} collection failed: ${error}`);
    return { sourceId: input.sourceId, collection: summary, error };
  }

  let rawDataId: number;

  try {
    rawDataId = (await saveRawData(collection)).id;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save RawData";
    console.error(`[ingestion] Source ${input.sourceId} could not save RawData: ${message}`);
    return { sourceId: input.sourceId, collection: summary, error: message };
  }

  if (!isHtmlContent(collection)) {
    const error = `Unsupported opportunity content type: ${collection.contentType}`;
    console.info(`[ingestion] Source ${input.sourceId} retained RawData ${rawDataId}: ${error}`);
    return { sourceId: input.sourceId, collection: summary, rawDataId, error };
  }

  try {
    const extracted = extractOpportunityFromCollection(
      collection,
      input.sourceUrl,
      input.sourceName,
      input.officialUrl
    );
    const normalized = normalizeOpportunity(extracted);
    const validation = validateOpportunity(normalized);
    const fingerprint = generateOpportunityFingerprint(normalized);
    const persistence = await persistOpportunity(normalized, validation, fingerprint);

    console.info(
      `[ingestion] Source ${input.sourceId} processed RawData ${rawDataId}: ` +
      `${validation.status}${persistence.action ? ` (${persistence.action})` : ""}`
    );

    return {
      sourceId: input.sourceId,
      collection: summary,
      rawDataId,
      extracted,
      validation,
      fingerprint,
      persistence,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ingestion error";
    console.error(`[ingestion] Source ${input.sourceId} failed after RawData ${rawDataId}: ${message}`);
    return {
      sourceId: input.sourceId,
      collection: summary,
      rawDataId,
      error: message,
    };
  }
}

/** Executes the Day 2 source-homepage flow. */
export async function ingestSource(sourceId: number): Promise<IngestionResult> {
  const source = await prisma.source.findUnique({
    where: { id: sourceId },
    select: { id: true, name: true, sourceUrl: true },
  });

  if (!source) {
    throw new Error(`Source with ID ${sourceId} not found`);
  }

  return ingestCollectedOpportunity(
    {
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: source.sourceUrl,
    },
    await collectFromSource(source.id)
  );
}
