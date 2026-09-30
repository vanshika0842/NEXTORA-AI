import prisma from "../lib/prisma";

import { saveRawData } from "./rawData.service";

import type {
  CollectionResult,
} from "../collectors/collector.types";

import { WebsiteCollector } from "../collectors/website.collector";

const websiteCollector = new WebsiteCollector();

export const collectFromSource = async (
  sourceId: number
): Promise<CollectionResult> => {
  const source = await prisma.source.findUnique({
    where: {
      id: sourceId,
    },
    include: {
      configuration: true,
    },
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

  await prisma.source.update({
    where: {
      id: source.id,
    },
    data: {
      lastCheckedAt: new Date(),
    },
  });

  let result: CollectionResult;

  switch (source.collectionMethod) {
    case "WEBSITE":
      result = await websiteCollector.collect(
        source.id,
        source.sourceUrl
      );
      break;

    case "API":
      throw new Error("API collector is not implemented yet");

    case "RSS":
      throw new Error("RSS collector is not implemented yet");

    case "SITEMAP":
      throw new Error("Sitemap collector is not implemented yet");

    case "MANUAL":
      throw new Error(
        "Manual collector does not support automatic collection"
      );

    default:
      throw new Error(
        `Unsupported collection method: ${source.collectionMethod}`
      );
  }

  if (result.success) {
  await prisma.source.update({
    where: {
      id: source.id,
    },
    data: {
      lastSuccessfulRunAt: new Date(),
    },
  });
  await saveRawData(result);

}

return result;
}