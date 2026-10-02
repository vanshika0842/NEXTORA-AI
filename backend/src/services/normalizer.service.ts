import * as cheerio from "cheerio";

export interface NormalizedOpportunity {
  title: string | null;
  organization: string | null;
  category: string | null;
  description: string | null;
  eligibility: string | null;
  location: string | null;
  applicationStartDate: string | null;
  deadline: string | null;
  officialWebsite: string | null;
  sourceUrl: string | null;
}

function htmlToText(html: string): string {
  const $ = cheerio.load(html);

  $("script").remove();
  $("style").remove();
  $("noscript").remove();

  return $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle($: cheerio.CheerioAPI): string | null {
  const h1 = $("h1").first().text().trim();

  if (h1) {
    return h1;
  }

  const title = $("title").first().text().trim();

  return title || null;
}

export function normalizeRawData(rawData: {
  url: string;
  contentType: string | null;
  rawContent: string;
}): NormalizedOpportunity {
  const $ = cheerio.load(rawData.rawContent);

  $("script").remove();
  $("style").remove();
  $("noscript").remove();

  const title = extractTitle($);

  const text = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  return {
    title,
    organization: null,
    category: null,
    description: text || null,
    eligibility: null,
    location: null,
    applicationStartDate: null,
    deadline: null,
    officialWebsite: null,
    sourceUrl: rawData.url,
  };
}