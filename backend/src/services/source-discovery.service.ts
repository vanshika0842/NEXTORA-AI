import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

import prisma from "../lib/prisma";

import type { CollectionResult } from "../collectors/collector.types";
import type { IngestionResult } from "./opportunity-ingestion.service";
import type { ValidationStatus } from "./opportunity-validator.service";

import { collectUrlFromSource } from "./collector.service";
import { ingestCollectedOpportunity } from "./opportunity-ingestion.service";
import { saveRawData } from "./rawData.service";

export interface SourceDiscoveryConfig {
  listingUrls?: string[];
  linkSelector?: string;
  itemSelector?: string;
  itemDetailLinkSelector?: string;
  itemDetailLinkText?: string;
  allowedDomains?: string[];
  allowExternalDomains?: boolean;
  requireOpportunityKeywords?: boolean;
  maxCandidates?: number;
  excludedUrlPatterns?: string[];
  nextPageSelector?: string;
  maxPages?: number;
  maxDetailPages?: number;
  maxRuntimeMs?: number;
  crawlDelayMs?: number;
  retryCount?: number;
}

export interface DiscoveredOpportunity {
  kind: "DETAIL_PAGE" | "INLINE_LISTING_ITEM";
  url: string;
  label: string;
  listingUrl: string;
  html?: string;
}

export interface DiscoveryResult {
  candidates: DiscoveredOpportunity[];
  ignoredLinks: number;
}

export interface DiscoveryRunResult {
  sourceId: number;
  listingsCollected: number;
  listingRawDataSaved: number;
  discovered: number;
  detailPagesCollected: number;
  inlineItemsProcessed: number;
  extracted: number;
  validationCounts: Record<ValidationStatus, number>;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

const DEFAULT_MAX_CANDIDATES = 50;
const OPPORTUNITY_TERMS = /\b(scholarship|internship|fellowship|competition|course|certification|exam|research|program|scheme)\b/i;
const DEFAULT_EXCLUDED_URL_PATTERNS = [
  "login",
  "logout",
  "signout",
  "session",
  "captcha",
  "password",
];

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const values = value.flatMap((item) => {
    const stringValue = readString(item);
    return stringValue ? [stringValue] : [];
  });

  return values.length > 0 ? values : undefined;
}

/** Reads the discovery subsection from SourceConfiguration.parsingConfig. */
export function parseSourceDiscoveryConfig(value: unknown): SourceDiscoveryConfig {
  const parsingConfig = asRecord(value);
  const discovery = asRecord(parsingConfig?.discovery);

  if (!discovery) {
    return {};
  }

  const maxCandidates = typeof discovery.maxCandidates === "number" &&
    Number.isInteger(discovery.maxCandidates) && discovery.maxCandidates > 0
    ? discovery.maxCandidates
    : undefined;

  const positiveInteger = (value: unknown): number | undefined =>
    typeof value === "number" && Number.isInteger(value) && value > 0
      ? value
      : undefined;

  const nonNegativeInteger = (value: unknown): number | undefined =>
    typeof value === "number" && Number.isInteger(value) && value >= 0
      ? value
      : undefined;

  return {
    listingUrls: readStringArray(discovery.listingUrls),
    linkSelector: readString(discovery.linkSelector),
    itemSelector: readString(discovery.itemSelector),
    itemDetailLinkSelector: readString(discovery.itemDetailLinkSelector),
    itemDetailLinkText: readString(discovery.itemDetailLinkText),
    allowedDomains: readStringArray(discovery.allowedDomains),
    allowExternalDomains: discovery.allowExternalDomains === true,
    requireOpportunityKeywords: discovery.requireOpportunityKeywords !== false,
    maxCandidates,
    excludedUrlPatterns: readStringArray(discovery.excludedUrlPatterns),
    nextPageSelector: readString(discovery.nextPageSelector),
    maxPages: positiveInteger(discovery.maxPages),
    maxDetailPages: positiveInteger(discovery.maxDetailPages),
    maxRuntimeMs: positiveInteger(discovery.maxRuntimeMs),
    crawlDelayMs: nonNegativeInteger(discovery.crawlDelayMs),
    retryCount: nonNegativeInteger(discovery.retryCount),
  };
}

/** Resolves a crawl URL and applies the shared scheme/domain safety rules. */
export function normalizeCrawlUrl(
  href: string | undefined,
  baseUrl: string,
  config: SourceDiscoveryConfig
): string | null {
  if (!href || href.trim().startsWith("#")) {
    return null;
  }

  try {
    const base = new URL(baseUrl);
    const url = new URL(href.trim(), base);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    url.hash = "";

    // URL.toString() retains a root slash, but remove all other trailing
    // slashes so equivalent candidate URLs have one stable queue key.
    if (url.pathname.length > 1) {
      url.pathname = url.pathname.replace(/\/+$/, "");
    }

    const allowedDomains = config.allowedDomains?.map((domain) => domain.toLowerCase()) ?? [base.hostname.toLowerCase()];
    const hostname = url.hostname.toLowerCase();
    const allowed = allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );

    if (!config.allowExternalDomains && !allowed) {
      return null;
    }

    const excludedPatterns = [
      ...DEFAULT_EXCLUDED_URL_PATTERNS,
      ...(config.excludedUrlPatterns ?? []),
    ];
    const urlText = url.toString().toLowerCase();

    if (excludedPatterns.some((pattern) => urlText.includes(pattern.toLowerCase()))) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function firstItemLink(
  $: cheerio.CheerioAPI,
  element: AnyNode,
  listingUrl: string,
  config: SourceDiscoveryConfig
): string | null {
  const links = $(element).find(config.itemDetailLinkSelector ?? "a[href]");
  const requiredText = config.itemDetailLinkText?.toLowerCase();

  for (const link of links.toArray()) {
    const linkText = cleanText($(link).text()).toLowerCase();

    if (requiredText && !linkText.includes(requiredText)) {
      continue;
    }

    const url = normalizeCrawlUrl($(link).attr("href"), listingUrl, config);
    if (url) {
      return url;
    }
  }

  return null;
}

/**
 * Finds safe opportunity links or configured inline listing items. This is
 * pure so each source configuration can be tested without network access.
 */
export function discoverOpportunities(
  html: string,
  listingUrl: string,
  config: SourceDiscoveryConfig = {}
): DiscoveryResult {
  const $ = cheerio.load(html);
  const candidates: DiscoveredOpportunity[] = [];
  const seen = new Set<string>();
  let ignoredLinks = 0;
  const maxCandidates = config.maxCandidates ?? DEFAULT_MAX_CANDIDATES;

  if (config.itemSelector) {
    $(config.itemSelector).each((_, element) => {
      if (candidates.length >= maxCandidates) {
        return false;
      }

      const text = cleanText($(element).text());
      const url = firstItemLink($, element, listingUrl, config);

      if (!url || (config.requireOpportunityKeywords !== false && !OPPORTUNITY_TERMS.test(text))) {
        ignoredLinks++;
        return;
      }

      const key = `${url}|${text.toLowerCase()}`;
      if (seen.has(key)) {
        ignoredLinks++;
        return;
      }

      seen.add(key);
      candidates.push({
        kind: "INLINE_LISTING_ITEM",
        url,
        label: text,
        listingUrl,
        html: $.html(element),
      });
    });

    return { candidates, ignoredLinks };
  }

  $(config.linkSelector ?? "a[href]").each((_, element) => {
    if (candidates.length >= maxCandidates) {
      return false;
    }

    const label = cleanText($(element).text());
    const url = normalizeCrawlUrl($(element).attr("href"), listingUrl, config);
    const looksLikeOpportunity = OPPORTUNITY_TERMS.test(`${label} ${url ?? ""}`);

    if (!url || (config.requireOpportunityKeywords !== false && !looksLikeOpportunity)) {
      ignoredLinks++;
      return;
    }

    if (seen.has(url)) {
      ignoredLinks++;
      return;
    }

    seen.add(url);
    candidates.push({ kind: "DETAIL_PAGE", url, label, listingUrl });
  });

  return { candidates, ignoredLinks };
}

function initialCounts(): Record<ValidationStatus, number> {
  return { VALID: 0, REVIEW: 0, INVALID: 0, EXPIRED: 0 };
}

function isHtmlCollection(result: CollectionResult): boolean {
  return !result.contentType || result.contentType.toLowerCase().includes("text/html");
}

function recordIngestionResult(
  run: DiscoveryRunResult,
  result: IngestionResult
): void {
  if (result.extracted) {
    run.extracted++;
  }

  if (result.validation) {
    run.validationCounts[result.validation.status]++;
  }

  if (result.persistence?.action === "CREATED") {
    run.created++;
  } else if (result.persistence?.action === "UPDATED") {
    run.updated++;
  } else {
    run.skipped++;
  }

  if (result.error) {
    run.errors.push(result.error);
  }
}

/**
 * Collects configured listing pages, discovers candidates, and sends every
 * candidate through the canonical Day 2 ingestion function.
 */
export async function discoverAndIngestSource(
  sourceId: number
): Promise<DiscoveryRunResult> {
  const source = await prisma.source.findUnique({
    where: { id: sourceId },
    include: { configuration: true },
  });

  if (!source) {
    throw new Error(`Source with ID ${sourceId} not found`);
  }

  const config = parseSourceDiscoveryConfig(source.configuration?.parsingConfig);
  const listingUrls = config.listingUrls?.length ? config.listingUrls : [source.sourceUrl];
  const run: DiscoveryRunResult = {
    sourceId,
    listingsCollected: 0,
    listingRawDataSaved: 0,
    discovered: 0,
    detailPagesCollected: 0,
    inlineItemsProcessed: 0,
    extracted: 0,
    validationCounts: initialCounts(),
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };
  const processedDetailUrls = new Set<string>();

  for (const listingUrl of listingUrls) {
    const listing = await collectUrlFromSource(source.id, listingUrl);

    if (!listing.success || !listing.content) {
      run.errors.push(listing.error ?? `Could not collect listing ${listingUrl}`);
      continue;
    }

    run.listingsCollected++;

    try {
      await saveRawData(listing);
      run.listingRawDataSaved++;
    } catch (error) {
      run.errors.push(error instanceof Error ? error.message : "Unable to retain listing RawData");
      continue;
    }

    if (!isHtmlCollection(listing)) {
      run.errors.push(`Unsupported listing content type: ${listing.contentType}`);
      continue;
    }

    const discovery = discoverOpportunities(listing.content, listingUrl, config);
    run.discovered += discovery.candidates.length;
    console.info(
      `[discovery] Source ${source.id} found ${discovery.candidates.length} candidates on ${listingUrl}`
    );

    for (const candidate of discovery.candidates) {
      if (candidate.kind === "DETAIL_PAGE") {
        if (processedDetailUrls.has(candidate.url)) {
          continue;
        }

        processedDetailUrls.add(candidate.url);
        const detail = await collectUrlFromSource(source.id, candidate.url);

        if (detail.success) {
          run.detailPagesCollected++;
        }

        recordIngestionResult(
          run,
          await ingestCollectedOpportunity(
            {
              sourceId: source.id,
              sourceName: source.name,
              sourceUrl: candidate.url,
            },
            detail
          )
        );
        continue;
      }

      if (!candidate.html) {
        run.errors.push(`Inline listing item ${candidate.url} had no HTML`);
        continue;
      }

      run.inlineItemsProcessed++;
      recordIngestionResult(
        run,
        await ingestCollectedOpportunity(
          {
            sourceId: source.id,
            sourceName: source.name,
            sourceUrl: candidate.listingUrl,
            officialUrl: candidate.url,
          },
          {
            success: true,
            sourceId: source.id,
            collectedAt: listing.collectedAt,
            content: candidate.html,
            contentType: "text/html; profile=nextora-inline-listing-item",
            statusCode: listing.statusCode,
          }
        )
      );
    }
  }

  console.info(
    `[discovery] Source ${source.id} completed: ${run.discovered} candidates, ` +
    `${run.created} created, ${run.updated} updated, ${run.skipped} skipped`
  );
  return run;
}
