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

/**
 * Executes the only supported Day 2 ingestion path. Each successful response
 * is retained before extraction, so failures can be diagnosed from RawData.
 */
export async function ingestSource(
  sourceId: number
): Promise<IngestionResult> {
  const source = await prisma.source.findUnique({
    where: { id: sourceId },
    select: { id: true, name: true, sourceUrl: true },
  });

  if (!source) {
    throw new Error(`Source with ID ${sourceId} not found`);
  }

  const collection = await collectFromSource(sourceId);
  const summary = {
    success: collection.success,
    statusCode: collection.statusCode,
    contentType: collection.contentType,
    error: collection.error,
  };

  if (!collection.success || !collection.content) {
    const error = collection.error ?? "Collection failed or returned no content";
    console.error(`[ingestion] Source ${sourceId} collection failed: ${error}`);
    return { sourceId, collection: summary, error };
  }

  const rawData = await saveRawData(collection);

  try {
    const extracted = extractOpportunityFromCollection(
      collection,
      source.sourceUrl,
      source.name
    );
    const normalized = normalizeOpportunity(extracted);
    const validation = validateOpportunity(normalized);
    const fingerprint = generateOpportunityFingerprint(normalized);
    const persistence = await persistOpportunity(
      normalized,
      validation,
      fingerprint
    );

    console.info(
      `[ingestion] Source ${sourceId} processed RawData ${rawData.id}: ` +
      `${validation.status}${persistence.action ? ` (${persistence.action})` : ""}`
    );

    return {
      sourceId,
      collection: summary,
      rawDataId: rawData.id,
      extracted,
      validation,
      fingerprint,
      persistence,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ingestion error";
    console.error(`[ingestion] Source ${sourceId} failed after RawData ${rawData.id}: ${message}`);

    return {
      sourceId,
      collection: summary,
      rawDataId: rawData.id,
      error: message,
    };
  }
}
