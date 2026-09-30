export type CollectionMethod =
  | "WEBSITE"
  | "API"
  | "RSS"
  | "SITEMAP"
  | "MANUAL";

export interface CollectionResult {
  success: boolean;

  sourceId: number;

  collectedAt: Date;

  content?: string;

  contentType?: string;

  statusCode?: number;

  error?: string;
}

export interface Collector {
  collect(
    sourceId: number,
    sourceUrl: string
  ): Promise<CollectionResult>;
}