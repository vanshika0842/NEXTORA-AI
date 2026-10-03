import * as cheerio from "cheerio";

import prisma from "../lib/prisma";

import type { CollectionResult } from "../collectors/collector.types";
import type { IngestionResult } from "./opportunity-ingestion.service";
import type { ValidationStatus } from "./opportunity-validator.service";

import { collectUrlFromSource } from "./collector.service";
import {
  discoverOpportunities,
  normalizeCrawlUrl,
  parseSourceDiscoveryConfig,
  type SourceDiscoveryConfig,
} from "./source-discovery.service";
import { ingestCollectedOpportunity } from "./opportunity-ingestion.service";
import { saveRawData } from "./rawData.service";

const DEFAULT_MAX_PAGES = 10;
const DEFAULT_MAX_CANDIDATES = 50;
const DEFAULT_MAX_DETAIL_PAGES = 50;
const DEFAULT_RETRY_COUNT = 1;

export interface CrawlStatistics {
  sourceId: number;
  pagesVisited: number;
  listingsCollected: number;
  listingRawDataSaved: number;
  candidatesDiscovered: number;
  candidatesDeduplicated: number;
  detailPagesCollected: number;
  inlineItemsProcessed: number;
  extracted: number;
  validationCounts: Record<ValidationStatus, number>;
  created: number;
  updated: number;
  skipped: number;
  retries: number;
  errors: string[];
}

export interface CrawlSourceInput {
  id: number;
  name: string;
  sourceUrl: string;
}

export interface CrawlerDependencies {
  collect(sourceId: number, url: string): Promise<CollectionResult>;
  saveListingRawData(collection: CollectionResult): Promise<unknown>;
  ingest(input: {
    sourceId: number;
    sourceName: string;
    sourceUrl: string;
    officialUrl?: string | null;
  }, collection: CollectionResult): Promise<IngestionResult>;
  sleep(milliseconds: number): Promise<void>;
  now(): number;
}

function validationCounts(): Record<ValidationStatus, number> {
  return { VALID: 0, REVIEW: 0, INVALID: 0, EXPIRED: 0 };
}

function initialStatistics(sourceId: number): CrawlStatistics {
  return {
    sourceId, pagesVisited: 0, listingsCollected: 0, listingRawDataSaved: 0,
    candidatesDiscovered: 0, candidatesDeduplicated: 0, detailPagesCollected: 0,
    inlineItemsProcessed: 0, extracted: 0, validationCounts: validationCounts(),
    created: 0, updated: 0, skipped: 0, retries: 0, errors: [],
  };
}

function isHtml(result: CollectionResult): boolean {
  return !result.contentType || result.contentType.toLowerCase().includes("text/html");
}

function retryable(result: CollectionResult): boolean {
  if (result.success) return false;
  if (result.statusCode === undefined) return true;
  return result.statusCode === 408 || result.statusCode === 429 || result.statusCode >= 500;
}

function nextPageUrl(html: string, listingUrl: string, config: SourceDiscoveryConfig): string | null {
  if (!config.nextPageSelector) return null;
  const $ = cheerio.load(html);
  return normalizeCrawlUrl($(config.nextPageSelector).first().attr("href"), listingUrl, config);
}

function recordIngestion(statistics: CrawlStatistics, result: IngestionResult): void {
  if (result.extracted) statistics.extracted++;
  if (result.validation) statistics.validationCounts[result.validation.status]++;
  if (result.persistence?.action === "CREATED") statistics.created++;
  else if (result.persistence?.action === "UPDATED") statistics.updated++;
  else statistics.skipped++;
  if (result.error) statistics.errors.push(result.error);
}

async function collectWithRetry(
  sourceId: number, url: string, retryCount: number, delayMs: number,
  dependencies: CrawlerDependencies, statistics: CrawlStatistics
): Promise<CollectionResult> {
  for (let attempt = 0; ; attempt++) {
    if (attempt > 0) {
      statistics.retries++;
      await dependencies.sleep(delayMs * attempt);
    }
    const result = await dependencies.collect(sourceId, url);
    if (result.success || !retryable(result) || attempt >= retryCount) return result;
  }
}

/**
 * Deterministic crawler core. It remains intentionally serial: one source is
 * polite by default, with delay applied before retries and between requests.
 */
export async function crawlConfiguredSource(
  source: CrawlSourceInput,
  config: SourceDiscoveryConfig,
  dependencies: CrawlerDependencies
): Promise<CrawlStatistics> {
  const statistics = initialStatistics(source.id);
  const maxPages = config.maxPages ?? DEFAULT_MAX_PAGES;
  const maxCandidates = config.maxCandidates ?? DEFAULT_MAX_CANDIDATES;
  const maxDetailPages = config.maxDetailPages ?? DEFAULT_MAX_DETAIL_PAGES;
  const retryCount = config.retryCount ?? DEFAULT_RETRY_COUNT;
  const delayMs = config.crawlDelayMs ?? 0;
  const startedAt = dependencies.now();
  const listingQueue = [...(config.listingUrls?.length ? config.listingUrls : [source.sourceUrl])];
  const seenListings = new Set<string>();
  const seenCandidates = new Set<string>();
  let detailPages = 0;

  const expired = () => config.maxRuntimeMs !== undefined && dependencies.now() - startedAt >= config.maxRuntimeMs;

  while (listingQueue.length && statistics.pagesVisited < maxPages && !expired()) {
    const requestedUrl = listingQueue.shift()!;
    const listingUrl = normalizeCrawlUrl(requestedUrl, source.sourceUrl, config);
    if (!listingUrl || seenListings.has(listingUrl)) continue;
    seenListings.add(listingUrl);
    if (statistics.pagesVisited > 0 && delayMs) await dependencies.sleep(delayMs);

    statistics.pagesVisited++;
    const listing = await collectWithRetry(source.id, listingUrl, retryCount, delayMs, dependencies, statistics);
    if (!listing.success || !listing.content) {
      statistics.errors.push(listing.error ?? `Could not collect listing ${listingUrl}`);
      continue;
    }
    statistics.listingsCollected++;
    try {
      await dependencies.saveListingRawData(listing);
      statistics.listingRawDataSaved++;
    } catch (error) {
      statistics.errors.push(error instanceof Error ? error.message : "Unable to retain listing RawData");
      continue;
    }
    if (!isHtml(listing)) {
      statistics.errors.push(`Unsupported listing content type: ${listing.contentType}`);
      continue;
    }

    const discovered = discoverOpportunities(listing.content, listingUrl, { ...config, maxCandidates });
    for (const candidate of discovered.candidates) {
      if (statistics.candidatesDiscovered >= maxCandidates) break;
      const key = candidate.kind === "DETAIL_PAGE" ? candidate.url : `${candidate.url}|${candidate.label.toLowerCase()}`;
      if (seenCandidates.has(key)) {
        statistics.candidatesDeduplicated++;
        continue;
      }
      seenCandidates.add(key);
      statistics.candidatesDiscovered++;

      if (candidate.kind === "INLINE_LISTING_ITEM") {
        statistics.inlineItemsProcessed++;
        if (!candidate.html) {
          statistics.errors.push(`Inline listing item ${candidate.url} had no HTML`);
          statistics.skipped++;
          continue;
        }
        recordIngestion(statistics, await dependencies.ingest({
          sourceId: source.id, sourceName: source.name, sourceUrl: listingUrl, officialUrl: candidate.url,
        }, { success: true, sourceId: source.id, collectedAt: listing.collectedAt, content: candidate.html,
          contentType: "text/html; profile=nextora-inline-listing-item", statusCode: listing.statusCode }));
        continue;
      }

      if (detailPages >= maxDetailPages || expired()) {
        statistics.skipped++;
        continue;
      }
      if (delayMs) await dependencies.sleep(delayMs);
      detailPages++;
      const detail = await collectWithRetry(source.id, candidate.url, retryCount, delayMs, dependencies, statistics);
      if (detail.success) statistics.detailPagesCollected++;
      recordIngestion(statistics, await dependencies.ingest({
        sourceId: source.id, sourceName: source.name, sourceUrl: candidate.url,
      }, detail));
    }

    const next = nextPageUrl(listing.content, listingUrl, config);
    if (next && !seenListings.has(next) && statistics.pagesVisited < maxPages) listingQueue.push(next);
  }
  if (expired()) statistics.errors.push("Crawl stopped because maxRuntimeMs was reached");
  return statistics;
}

/** Loads persisted source configuration and runs the reusable crawler. */
export async function crawlSource(sourceId: number): Promise<CrawlStatistics> {
  const source = await prisma.source.findUnique({ where: { id: sourceId }, include: { configuration: true } });
  if (!source) throw new Error(`Source with ID ${sourceId} not found`);
  if (!source.active) throw new Error(`Source with ID ${sourceId} is inactive`);
  if (!source.configuration) throw new Error(`Source with ID ${sourceId} does not have a configuration`);
  return crawlConfiguredSource(source, parseSourceDiscoveryConfig(source.configuration.parsingConfig), {
    collect: collectUrlFromSource,
    saveListingRawData: saveRawData,
    ingest: ingestCollectedOpportunity,
    sleep: (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
    now: () => Date.now(),
  });
}
