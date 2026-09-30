import prisma from "../lib/prisma";

import type { CollectionResult } from "../collectors/collector.types";

export const saveRawData = async (
  result: CollectionResult
) => {
  if (!result.success || !result.content) {
    throw new Error(
      "Cannot save raw data from an unsuccessful collection"
    );
  }

  const rawData = await prisma.rawData.create({
    data: {
      sourceId: result.sourceId,
      content: result.content,
      contentType: result.contentType,
      statusCode: result.statusCode,
      collectedAt: result.collectedAt,
    },
  });

  return rawData;
};