import prisma from "../lib/prisma";

import type { CollectionResult } from "../collectors/collector.types";

import { WebsiteCollector } from "../collectors/website.collector";

const websiteCollector = new WebsiteCollector();

/**
 * Collect a permitted URL for an existing source. The source check remains
 * centralized here so listing and detail collection follow the same rules.
 */
export const collectUrlFromSource = async (
  sourceId: number,
  url: string
): Promise<CollectionResult> => {
  const source = await prisma.source.findUnique({
    where: { id: sourceId },
    include: { configuration: true },
  });

  if (!source) {
    throw new Error(`Source with ID ${sourceId} not found`);
  }

  if (!source.active) {
    throw new Error(`Source with ID ${sourceId} is inactive`);
  }

  if (!source.configuration) {
    throw new Error(
      `Source with ID ${sourceId} does not have a configuration`
    );
  }

  if (source.collectionMethod !== "WEBSITE") {
    throw new Error(
      `Unsupported collection method: ${source.collectionMethod}`
    );
  }

  await prisma.source.update({
    where: { id: source.id },
    data: { lastCheckedAt: new Date() },
  });

  const result = await websiteCollector.collect(source.id, url);

  if (result.success) {
    await prisma.source.update({
      where: { id: source.id },
      data: { lastSuccessfulRunAt: new Date() },
    });
  }

  return result;
};

export const collectFromSource = async (
  sourceId: number
): Promise<CollectionResult> => {
  const source = await prisma.source.findUnique({
    where: { id: sourceId },
    select: { id: true, sourceUrl: true },
  });

  if (!source) {
    throw new Error(`Source with ID ${sourceId} not found`);
  }

  return collectUrlFromSource(source.id, source.sourceUrl);
};
