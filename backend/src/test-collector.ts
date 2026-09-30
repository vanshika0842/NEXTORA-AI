import "dotenv/config";

import { collectFromSource } from "./services/collector.service";

const run = async () => {
  try {
    const result = await collectFromSource(2);

    console.log("Collection result:");
    console.log({
      success: result.success,
      sourceId: result.sourceId,
      contentType: result.contentType,
      statusCode: result.statusCode,
      contentLength: result.content?.length,
      collectedAt: result.collectedAt,
      error: result.error,
    });
  } catch (error) {
    console.error("Collection failed:");

    console.error(
      error instanceof Error
        ? error.message
        : error
    );
  }
};

run();