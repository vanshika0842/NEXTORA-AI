import type {
  Collector,
  CollectionResult,
} from "./collector.types";

export class WebsiteCollector implements Collector {
  async collect(
    sourceId: number,
    sourceUrl: string
  ): Promise<CollectionResult> {
    const collectedAt = new Date();

    try {
      const response = await fetch(sourceUrl);

      const content = await response.text();

      return {
        success: response.ok,
        sourceId,
        collectedAt,
        content,
        contentType: response.headers.get("content-type") ?? undefined,
        statusCode: response.status,
      };
    } catch (error) {
      return {
        success: false,
        sourceId,
        collectedAt,
        error:
          error instanceof Error
            ? error.message
            : "Unknown collection error",
      };
    }
  }
}