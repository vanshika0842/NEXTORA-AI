import * as cheerio from "cheerio";
import type {
  ExtractedOpportunity,
  OpportunityExtractorInput,
} from "./extractor.types";

/* =========================================================
   BASIC TEXT HELPERS
========================================================= */

function cleanText(
  value: string | undefined | null
): string | null {
  if (!value) return null;

  const cleaned = value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[:\-–—]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   OPPORTUNITY TYPE
========================================================= */

function detectType(
  text: string
): ExtractedOpportunity["type"] {
  const value = text.toLowerCase();

  const scores: Record<string, number> = {
    INTERNSHIP: 0,
    SCHOLARSHIP: 0,
    CERTIFICATION: 0,
    FELLOWSHIP: 0,
    COMPETITION: 0,
    RESEARCH: 0,
    EXAM: 0,
    COURSE: 0,
    CAREER_PROGRAM: 0,
    INTERNATIONAL: 0,
  };

  if (/\binternship(s)?\b/.test(value)) {
    scores.INTERNSHIP += 5;
  }

  if (/\bintern\b/.test(value)) {
    scores.INTERNSHIP += 3;
  }

  if (/\bscholarship(s)?\b/.test(value)) {
    scores.SCHOLARSHIP += 5;
  }

  if (/\bcertification(s)?\b/.test(value)) {
    scores.CERTIFICATION += 5;
  }

  if (/\bcertificate(s)?\b/.test(value)) {
    scores.CERTIFICATION += 2;
  }

  if (/\bfellowship(s)?\b/.test(value)) {
    scores.FELLOWSHIP += 5;
  }

  if (/\bcompetition(s)?\b/.test(value)) {
    scores.COMPETITION += 5;
  }

  if (/\bhackathon(s)?\b/.test(value)) {
    scores.COMPETITION += 4;
  }

  if (/\bresearch\b/.test(value)) {
    scores.RESEARCH += 5;
  }

  if (/\bexam(s)?\b/.test(value)) {
    scores.EXAM += 4;
  }

  if (/\bentrance\b/.test(value)) {
    scores.EXAM += 4;
  }

  if (/\bgate\b/.test(value)) {
    scores.EXAM += 4;
  }

  if (/\bupsc\b/.test(value)) {
    scores.EXAM += 4;
  }

  if (/\bcourse(s)?\b/.test(value)) {
    scores.COURSE += 4;
  }

  if (
    /\bcareer\s+(program|programme)\b/.test(value) ||
    /\bgraduate\s+(program|programme)\b/.test(value) ||
    /\btrainee\s+(program|programme)\b/.test(value)
  ) {
    scores.CAREER_PROGRAM += 5;
  }

  if (
    /\binternational\b/.test(value) ||
    /\bstudy\s+abroad\b/.test(value) ||
    /\babroad\s+opportunit/.test(value)
  ) {
    scores.INTERNATIONAL += 5;
  }

  const sorted = Object.entries(scores).sort(
    (a, b) => b[1] - a[1]
  );

  if (sorted.length === 0 || sorted[0][1] === 0) {
    return null;
  }

  return sorted[0][0] as ExtractedOpportunity["type"];
}

/* =========================================================
   DATE EXTRACTION
========================================================= */

/*
Supported:

31-10-2026
31/10/2026
31.10.2026

31 October 2026
31st October 2026
1'st June 2026

October 31, 2026
Oct 31, 2026

2026-10-31
*/

const DATE_TOKEN = String.raw`(?:\d{1,2}'?(?:st|nd|rd|th)?[./-]\d{1,2}[./-]\d{4}|\d{1,2}'?(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+\d{4}|(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})`;

function extractDate(
  text: string,
  labels: string[]
): string | null {
  if (!text) return null;

  const labelPattern = labels
    .map(escapeRegExp)
    .join("|");

  const regex = new RegExp(
    String.raw`(?:${labelPattern})[^0-9]{0,100}(?:is|are|from|on|by|:|-|–|—)?\s*(${DATE_TOKEN})`,
    "i"
  );

  const match = text.match(regex);

  return cleanText(match?.[1]);
}

/* =========================================================
   DEADLINE EXTRACTION
========================================================= */

/*
IMPORTANT:

Pages can contain multiple dates:

- student application deadline
- institute verification deadline
- L2 verification deadline
- document verification deadline
- result date

The extractor MUST prioritize the actual student/application
deadline instead of simply taking the first date on the page.
*/

function extractDeadline(
  pageText: string
): string | null {
  if (!pageText) return null;

  const patterns: RegExp[] = [
    /*
      Highest priority.

      Example:
      Closing dates for student application is 31-10-2026
    */
    new RegExp(
      String.raw`closing\s+dates?\s+for\s+(?:the\s+)?student\s+application\s*(?:is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    /*
      Example:
      Closing date for student application is 31-10-2026
    */
    new RegExp(
      String.raw`closing\s+date\s+for\s+(?:the\s+)?student\s+application\s*(?:is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    /*
      Example:
      Student application deadline: 31-10-2026
    */
    new RegExp(
      String.raw`student\s+application\s+(?:deadline|closing\s+date|last\s+date)\s*(?:is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    /*
      Example:
      Last date to apply: 31-10-2026
    */
    new RegExp(
      String.raw`last\s+date\s+(?:to\s+)?apply\s*(?:is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    /*
      Example:
      Application deadline: 31-10-2026
    */
    new RegExp(
      String.raw`application\s+deadline\s*(?:is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    /*
      Example:
      Applications close on 31-10-2026
    */
    new RegExp(
      String.raw`applications?\s+(?:close|closes|closing)\s*(?:on|is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    /*
      Example:
      Closing date: 31-10-2026
    */
    new RegExp(
      String.raw`closing\s+date\s*(?:is|are|on)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    /*
      Example:
      Apply by 31-10-2026
    */
    new RegExp(
      String.raw`apply\s+by\s*(?:is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    /*
      Example:
      Submission deadline: 31-10-2026
    */
    new RegExp(
      String.raw`submission\s+deadline\s*(?:is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    /*
      Generic fallback.
    */
    new RegExp(
      String.raw`(?:deadline|last\s+date|closing\s+date|apply\s+by|application\s+closes?)[^0-9]{0,120}(${DATE_TOKEN})`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = pageText.match(pattern);

    if (match?.[1]) {
      return cleanText(match[1]);
    }
  }

  return null;
}

/* =========================================================
   APPLICATION START DATE
========================================================= */

function extractApplicationStartDate(
  pageText: string
): string | null {
  if (!pageText) return null;

  const patterns: RegExp[] = [
    new RegExp(
      String.raw`application\s+start\s+date\s*(?:is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    new RegExp(
      String.raw`application\s+starts?\s*(?:on|from|is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    new RegExp(
      String.raw`application\s+opens?\s*(?:on|from|is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    new RegExp(
      String.raw`registration\s+starts?\s*(?:on|from|is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    new RegExp(
      String.raw`registration\s+opens?\s*(?:on|from|is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    new RegExp(
      String.raw`opening\s+date\s*(?:is|are)?\s*:?\s*(${DATE_TOKEN})`,
      "i"
    ),

    /*
      Example:

      Portal is open for Academic year 2026-27
      from 1'st June 2026 onwards
    */
    new RegExp(
      String.raw`(?:portal|application|registration)[^0-9]{0,150}?from\s*(${DATE_TOKEN})`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = pageText.match(pattern);

    if (match?.[1]) {
      return cleanText(match[1]);
    }
  }

  return null;
}

/* =========================================================
   HTML SECTION EXTRACTION
========================================================= */

function extractSection(
  $: cheerio.CheerioAPI,
  labels: string[]
): string | null {
  const normalizedLabels = labels.map(normalizeHeading);

  let result: string | null = null;

  $("h1, h2, h3, h4, h5, h6, strong, b, th, dt").each(
    (_, element) => {
      if (result) return;

      const heading = cleanText($(element).text());

      if (!heading) return;

      if (
        !normalizedLabels.includes(
          normalizeHeading(heading)
        )
      ) {
        return;
      }

      const parts: string[] = [];

      let current = $(element).next();
      let count = 0;

      while (current.length && count < 10) {
        const tagName = (
          current.get(0)?.tagName ?? ""
        ).toLowerCase();

        if (/^h[1-6]$/.test(tagName)) {
          break;
        }

        const text = cleanText(current.text());

        if (text) {
          parts.push(text);
        }

        current = current.next();
        count++;
      }

      if (parts.length > 0) {
        result = cleanText(parts.join(" "));
      }
    }
  );

  return result;
}

/* =========================================================
   LABELED VALUE EXTRACTION
========================================================= */

function extractLabeledValue(
  pageText: string,
  labels: string[]
): string | null {
  if (!pageText) return null;

  const labelPattern = labels
    .map(escapeRegExp)
    .join("|");

  const regex = new RegExp(
    String.raw`(?:${labelPattern})\s*(?:is|are|:|-|–|—)\s*([^.!?]{1,700})`,
    "i"
  );

  const match = pageText.match(regex);

  return cleanText(match?.[1]);
}

/* =========================================================
   URL HELPERS
========================================================= */

function resolveUrl(
  value: string | null,
  sourceUrl: string
): string | null {
  if (!value) return null;

  try {
    return new URL(value, sourceUrl).toString();
  } catch {
    return null;
  }
}

/* =========================================================
   APPLICATION URL
========================================================= */

function extractApplicationUrl(
  $: cheerio.CheerioAPI,
  sourceUrl: string
): string | null {
  let bestUrl: string | null = null;
  let bestScore = -1;

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");

    if (!href) return;

    const hrefLower = href.toLowerCase();

    if (
      hrefLower.startsWith("#") ||
      hrefLower.startsWith("javascript:") ||
      hrefLower.startsWith("mailto:") ||
      hrefLower.startsWith("tel:")
    ) {
      return;
    }

    const text =
      cleanText($(element).text())?.toLowerCase() ?? "";

    const aria =
      cleanText($(element).attr("aria-label"))?.toLowerCase() ??
      "";

    const combined = `${text} ${aria} ${hrefLower}`;

    let score = 0;

    if (/\bapply\b/.test(combined)) {
      score += 10;
    }

    if (/\bapplication\b/.test(combined)) {
      score += 8;
    }

    if (/\bregister\b/.test(combined)) {
      score += 8;
    }

    if (/\bregistration\b/.test(combined)) {
      score += 7;
    }

    if (/\benroll\b/.test(combined)) {
      score += 6;
    }

    if (/\badmission\b/.test(combined)) {
      score += 5;
    }

    if (score <= 0) return;

    const resolved = resolveUrl(href, sourceUrl);

    if (!resolved) return;

    if (score > bestScore) {
      bestScore = score;
      bestUrl = resolved;
    }
  });

  return bestUrl;
}

/* =========================================================
   JSON-LD
========================================================= */

function extractJsonLd(
  $: cheerio.CheerioAPI
): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];

  const addValue = (value: unknown) => {
    if (!value) return;

    if (Array.isArray(value)) {
      for (const item of value) {
        addValue(item);
      }

      return;
    }

    if (
      typeof value === "object" &&
      value !== null
    ) {
      const object = value as Record<string, unknown>;

      if (Array.isArray(object["@graph"])) {
        addValue(object["@graph"]);
      }

      results.push(object);
    }
  };

  $('script[type="application/ld+json"]').each(
    (_, element) => {
      const raw = $(element).html();

      if (!raw) return;

      try {
        const parsed = JSON.parse(raw);
        addValue(parsed);
      } catch {
        // Invalid JSON-LD is ignored.
      }
    }
  );

  return results;
}

function getJsonLdValue(
  jsonLd: Record<string, unknown>[],
  keys: string[]
): string | null {
  for (const item of jsonLd) {
    for (const key of keys) {
      const value = item[key];

      if (typeof value === "string") {
        const cleaned = cleanText(value);

        if (cleaned) {
          return cleaned;
        }
      }

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        const object = value as Record<string, unknown>;

        if (typeof object.name === "string") {
          const cleaned = cleanText(object.name);

          if (cleaned) {
            return cleaned;
          }
        }
      }
    }
  }

  return null;
}

/* =========================================================
   TITLE
========================================================= */

function extractTitle(
  $: cheerio.CheerioAPI,
  jsonLd: Record<string, unknown>[]
): string | null {
  return (
    cleanText($("h1").first().text()) ??
    getJsonLdValue(jsonLd, [
      "name",
      "headline",
      "title",
    ]) ??
    cleanText(
      $('meta[property="og:title"]')
        .attr("content")
    ) ??
    cleanText($("title").first().text())
  );
}

/* =========================================================
   ORGANIZATION
========================================================= */

function extractOrganization(
  $: cheerio.CheerioAPI,
  jsonLd: Record<string, unknown>[],
  sourceName: string | null | undefined,
  sourceUrl: string
): string | null {
  const organization =
    cleanText(
      $('meta[property="og:site_name"]')
        .attr("content")
    ) ??
    getJsonLdValue(jsonLd, [
      "organization",
      "publisher",
      "provider",
      "sponsor",
      "author",
    ]) ??
    cleanText(sourceName);

  if (organization) {
    return organization;
  }

  try {
    return new URL(sourceUrl)
      .hostname
      .replace(/^www\./, "");
  } catch {
    return null;
  }
}

/* =========================================================
   DESCRIPTION
========================================================= */

function extractDescription(
  $: cheerio.CheerioAPI,
  jsonLd: Record<string, unknown>[]
): string | null {
  const metadata =
    cleanText(
      $('meta[name="description"]')
        .attr("content")
    ) ??
    cleanText(
      $('meta[property="og:description"]')
        .attr("content")
    ) ??
    getJsonLdValue(jsonLd, [
      "description",
    ]);

  if (metadata) {
    return metadata;
  }

  const selectors = [
    "main p",
    "article p",
    ".content p",
    "#content p",
    ".description p",
    ".announcement-wrap p",
    "p",
  ];

  for (const selector of selectors) {
    let result: string | null = null;

    $(selector).each((_, element) => {
      if (result) return;

      const text = cleanText($(element).text());

      if (text && text.length >= 40) {
        result = text;
      }
    });

    if (result) {
      return result;
    }
  }

  return null;
}

/* =========================================================
   ELIGIBILITY
========================================================= */

function extractEligibility(
  $: cheerio.CheerioAPI,
  pageText: string
): string | null {
  const section = extractSection(
    $,
    [
      "Eligibility",
      "Eligibility Criteria",
      "Eligibility Requirements",
      "Who Can Apply",
      "Eligible Candidates",
      "Who is eligible",
      "Eligibility Conditions",
    ]
  );

  if (section) {
    return section;
  }

  const labeled = extractLabeledValue(
    pageText,
    [
      "Eligibility",
      "Eligibility Criteria",
      "Eligibility Requirements",
      "Who Can Apply",
      "Eligible Candidates",
    ]
  );

  if (labeled) {
    return labeled;
  }

  const patterns = [
    /eligible\s+candidates?\s+(?:must|should|need\s+to)\s+([^.!?]{30,700})/i,
    /candidates?\s+(?:must|should|need\s+to)\s+be\s+([^.!?]{30,700})/i,
    /students?\s+(?:must|should|need\s+to)\s+be\s+([^.!?]{30,700})/i,
  ];

  for (const pattern of patterns) {
    const match = pageText.match(pattern);

    if (match?.[0]) {
      return cleanText(match[0]);
    }
  }

  return null;
}

/* =========================================================
   LOCATION
========================================================= */

function extractLocation(
  $: cheerio.CheerioAPI,
  pageText: string
): string | null {
  const section = extractSection(
    $,
    [
      "Location",
      "Job Location",
      "Work Location",
      "Study Location",
      "Place",
      "Venue",
    ]
  );

  if (section) {
    return section;
  }

  return extractLabeledValue(
    pageText,
    [
      "Location",
      "Job Location",
      "Work Location",
      "Study Location",
      "Place",
      "Venue",
    ]
  );
}

/* =========================================================
   REMOTE
========================================================= */

function detectRemote(
  pageText: string
): boolean {
  return /\b(remote|work\s+from\s+home|fully\s+remote|remote\s+work|wfh)\b/i.test(
    pageText
  );
}

/* =========================================================
   ANNOUNCEMENT EXTRACTION
========================================================= */

function extractAnnouncementText(
  $: cheerio.CheerioAPI
): string | null {
  const selectors = [
    "section.announcement-wrap p",
    ".announcement-wrap p",
    "#table_scroll p",
    ".announcement p",
    ".announcements p",
  ];

  const parts: string[] = [];

  for (const selector of selectors) {
    $(selector).each((_, element) => {
      const text = cleanText($(element).text());

      if (text) {
        parts.push(text);
      }
    });

    if (parts.length > 0) {
      break;
    }
  }

  return cleanText(parts.join(" "));
}

/* =========================================================
   MAIN EXTRACTOR
========================================================= */

export function extractOpportunity(
  input: OpportunityExtractorInput
): ExtractedOpportunity {
  if (!input.html) {
    throw new Error(
      "Opportunity extractor received empty HTML."
    );
  }

  if (!input.sourceUrl) {
    throw new Error(
      "Opportunity extractor requires sourceUrl."
    );
  }

  const $ = cheerio.load(input.html);

  const jsonLd = extractJsonLd($);

  /*
    Remove non-content elements before creating page text.
  */
  $("script, style, noscript, svg").remove();

  const pageText =
    cleanText(
      $("body").text()
    ) ?? "";

  /* =======================================================
     TITLE
  ======================================================= */

  const title = extractTitle($, jsonLd);

  /* =======================================================
     ORGANIZATION
  ======================================================= */

  const organization =
    extractOrganization(
      $,
      jsonLd,
      input.sourceName,
      input.sourceUrl
    );

  /* =======================================================
     DESCRIPTION
  ======================================================= */

  const description =
    extractDescription($, jsonLd);

  /* =======================================================
     TYPE
  ======================================================= */

  /*
    Prefer title/headings/metadata first because full page text
    may contain navigation links for many unrelated categories.
  */
  const classificationText = cleanText(
    [
      title ?? "",
      $("h1, h2, h3").slice(0, 10).text(),
      organization ?? "",
      description ?? "",
    ].join(" ")
  );

  const type =
    detectType(classificationText ?? "") ??
    detectType(pageText);

  /* =======================================================
     APPLICATION URL
  ======================================================= */

  const applicationUrl =
    extractApplicationUrl(
      $,
      input.sourceUrl
    );

  /* =======================================================
     ANNOUNCEMENTS
  ======================================================= */

  const announcementText =
    extractAnnouncementText($);

  /* =======================================================
     DEADLINE
  ======================================================= */

  /*
    FIRST:
    Search announcement area because official portals often
    place the actual deadline there.

    SECOND:
    Search entire page.

    THIRD:
    Use generic labeled extraction.

    This prevents:
      Student application = 31-10-2026
      Institute verification = 15-11-2026
      L2 verification = 30-11-2026

    from incorrectly becoming 15-11-2026 or 30-11-2026.
  */

  const applicationDeadline =
    extractDeadline(
      announcementText ?? ""
    ) ??
    extractDeadline(pageText) ??
    extractDate(
      pageText,
      [
        "application deadline",
        "student application deadline",
        "deadline",
        "last date",
        "last date to apply",
        "closing date",
        "applications close",
        "apply by",
        "submission deadline",
      ]
    );

  /* =======================================================
     APPLICATION START DATE
  ======================================================= */

  const applicationStartDate =
    extractApplicationStartDate(
      announcementText ?? ""
    ) ??
    extractApplicationStartDate(
      pageText
    ) ??
    extractDate(
      pageText,
      [
        "application start date",
        "application starts",
        "application opens",
        "registration starts",
        "registration opens",
        "opening date",
        "start date",
      ]
    );

  /* =======================================================
     ELIGIBILITY
  ======================================================= */

  const eligibility =
    extractEligibility(
      $,
      pageText
    );

  /* =======================================================
     LOCATION
  ======================================================= */

  const location =
    extractLocation(
      $,
      pageText
    );

  /* =======================================================
     REMOTE
  ======================================================= */

  const isRemote =
    detectRemote(pageText);

  /* =======================================================
     CORE FALLBACKS
  ======================================================= */

  /*
    These fallbacks prevent unnecessary nulls while remaining
    transparent.

    We DO NOT invent actual factual information.
  */

  const finalTitle =
    title ??
    input.sourceName ??
    "Untitled Opportunity";

  const finalOrganization =
    organization ??
    input.sourceName ??
    (() => {
      try {
        return new URL(input.sourceUrl)
          .hostname
          .replace(/^www\./, "");
      } catch {
        return "Unknown Organization";
      }
    })();

  const finalDescription =
    description ??
    cleanText(
      input.sourceName
        ? `${input.sourceName} opportunity collected from the official source.`
        : "Opportunity collected from the official source."
    );

  /*
    Eligibility and location are source-dependent.
    We keep explicit fallback text instead of pretending we
    discovered information that the source did not publish.
  */

  const finalEligibility =
    eligibility ??
    "Not explicitly specified on the source page.";

  const finalLocation =
    location ??
    (isRemote
      ? "Remote"
      : "Not explicitly specified on the source page.");

  /*
    Deadline:
    Never manufacture a date.

    If the source does not publish a deadline, this remains null
    and the validator/normalizer should flag it for review.

    For the NSP page supplied in your test, the semantic extractor
    should return 31-10-2026.
  */

  /* =======================================================
     RESULT
  ======================================================= */

  return {
    title: finalTitle,

    organization: finalOrganization,

    type,

    description: finalDescription,

    eligibility: finalEligibility,

    location: finalLocation,

    isRemote,

    applicationStartDate,

    applicationDeadline,

    officialUrl:
      input.sourceUrl,

    applicationUrl,

    sourceName:
      input.sourceName ?? null,

    sourceUrl:
      input.sourceUrl,

    /*
      Extraction pipeline completed successfully.

      This is NOT a claim that the source itself is factually
      perfect. Validation should handle source-level confidence.
    */
    confidence: 1,
  };
}

/* =========================================================
   OPTIONAL COLLECTION RESULT WRAPPER
========================================================= */

/*
  This helper is useful if your ingestion service wants to pass
  the collector result directly into the extractor.

  It does not require importing your collector types, so it avoids
  circular dependencies.
*/

export function extractOpportunityFromCollection(
  collectionResult: {
    success: boolean;
    content?: string;
    error?: string;
  },
  sourceUrl: string,
  sourceName?: string | null
): ExtractedOpportunity {
  if (!collectionResult.success) {
    throw new Error(
      collectionResult.error ??
        "Collection failed before extraction."
    );
  }

  if (!collectionResult.content) {
    throw new Error(
      "Collection succeeded but returned empty content."
    );
  }

  return extractOpportunity({
    html: collectionResult.content,
    sourceUrl,
    sourceName,
  });
}