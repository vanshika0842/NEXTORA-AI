import assert from "node:assert/strict";

import type { CollectionResult } from "./collectors/collector.types";
import { crawlConfiguredSource } from "./services/source-crawler.service";
import { normalizeCrawlUrl } from "./services/source-discovery.service";

const source = { id: 77, name: "Fixture source", sourceUrl: "https://example.test/list" };
let clock = 0;
let sleeps: number[] = [];
let ingested: string[] = [];
let saved = 0;
const attempts = new Map<string, number>();

function response(url: string, content: string, statusCode = 200): CollectionResult {
  return { success: statusCode >= 200 && statusCode < 300, sourceId: source.id, collectedAt: new Date(),
    content, contentType: "text/html", statusCode, error: statusCode >= 400 ? `HTTP ${statusCode}: ${url}` : undefined };
}

const pages: Record<string, string> = {
  "https://example.test/list": `<a class="detail" href="/detail/a#top">A Scholarship</a><a rel="next" href="/page/2">next</a><a href="https://outside.test/detail">Outside Scholarship</a>`,
  "https://example.test/page/2": `<article class="card"><h3>Inline Scholarship</h3><a href="/guide">Guidelines</a></article><a class="detail" href="/detail/a/">Duplicate Scholarship</a>`,
  "https://example.test/detail/a": `<h1>Detail Scholarship</h1>`,
};

const dependencies = {
  async collect(_sourceId: number, url: string): Promise<CollectionResult> {
    const count = (attempts.get(url) ?? 0) + 1;
    attempts.set(url, count);
    if (url.endsWith("/detail/a") && count === 1) return response(url, "", 503);
    return response(url, pages[url] ?? "", pages[url] ? 200 : 404);
  },
  async saveListingRawData(): Promise<void> { saved++; },
  async ingest(input: { sourceUrl: string; officialUrl?: string | null }, collection: CollectionResult) {
    ingested.push(input.officialUrl ?? input.sourceUrl);
    return {
      sourceId: source.id,
      collection: { success: collection.success, statusCode: collection.statusCode, contentType: collection.contentType },
      extracted: collection.success ? { } as never : undefined,
      validation: collection.success ? { valid: false, status: "REVIEW" as const, errors: [], warnings: [], score: 50 } : undefined,
      persistence: { success: false, message: "not persisted" },
      error: collection.success ? undefined : collection.error,
    };
  },
  async sleep(milliseconds: number): Promise<void> { sleeps.push(milliseconds); clock += milliseconds; },
  now: () => clock,
};

async function main() {
  assert.equal(normalizeCrawlUrl("/detail/a/#fragment", source.sourceUrl, {}), "https://example.test/detail/a");
  assert.equal(normalizeCrawlUrl("mailto:x@example.test", source.sourceUrl, {}), null);
  assert.equal(normalizeCrawlUrl("https://outside.test/a", source.sourceUrl, {}), null);
  assert.equal(normalizeCrawlUrl("https://outside.test/a", source.sourceUrl, { allowExternalDomains: true }), "https://outside.test/a");
  assert.equal(normalizeCrawlUrl("/detail/a/?page=2#fragment", source.sourceUrl, {}), "https://example.test/detail/a?page=2");

  const result = await crawlConfiguredSource(source, {
    listingUrls: [source.sourceUrl], linkSelector: ".detail", nextPageSelector: "a[rel=next]",
    maxPages: 2, maxCandidates: 3, maxDetailPages: 1, crawlDelayMs: 5, retryCount: 1,
  }, dependencies);

  assert.equal(result.pagesVisited, 2);
  assert.equal(result.listingsCollected, 2);
  assert.equal(result.listingRawDataSaved, 2);
  assert.equal(result.candidatesDiscovered, 1);
  assert.equal(result.candidatesDeduplicated, 1);
  assert.equal(result.detailPagesCollected, 1);
  assert.equal(result.retries, 1);
  assert.equal(attempts.get("https://example.test/detail/a"), 2);
  assert.ok(sleeps.includes(5), "configured rate delay must be used");
  assert.equal(result.validationCounts.REVIEW, 1);
  assert.ok(ingested.includes("https://example.test/detail/a"));
  assert.equal(saved, 2);

  // Inline cards use the same ingestion dependency and respect candidate limits.
  clock = 0; sleeps = []; ingested = []; saved = 0; attempts.clear();
  const inline = await crawlConfiguredSource(source, {
    listingUrls: ["https://example.test/page/2"], itemSelector: ".card", itemDetailLinkText: "guidelines", requireOpportunityKeywords: false, maxPages: 1, maxCandidates: 1,
  }, dependencies);
  assert.equal(inline.inlineItemsProcessed, 1);
  assert.equal(inline.candidatesDiscovered, 1);
  assert.equal(inline.detailPagesCollected, 0);
  assert.ok(ingested.includes("https://example.test/guide"));

  console.log("Crawler assertions passed.");
}

main().catch((error) => { console.error("Crawler test failed:", error); process.exitCode = 1; });
