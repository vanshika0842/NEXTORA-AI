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
      const url = new URL(sourceUrl);

      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Only HTTP and HTTPS URLs can be collected");
      }

      const response = await fetch(url, {
        signal: AbortSignal.timeout(15_000),
      });

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
