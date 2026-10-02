import type { OpportunityType } from "../generated/prisma/client";
import type { ExtractedOpportunity } from "../extractors/extractor.types";

export interface NormalizedOpportunity {
  title: string;
  organization: string | null;
  type: OpportunityType | null;

  description: string | null;

  officialUrl: string | null;
  applicationUrl: string | null;

  location: string | null;
  isRemote: boolean;

  applicationStartDate: Date | null;
  applicationDeadline: Date | null;

  sourceName: string | null;
  sourceUrl: string;

  normalizedAt: Date;
}

const cleanString = (
  value: string | null | undefined
): string | null => {
  if (!value) {
    return null;
  }

  const cleaned = value
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 0 ? cleaned : null;
};

const parseDate = (
  value: string | null | undefined
): Date | null => {
  if (!value) {
    return null;
  }

  const cleaned = value.trim();
  const dayFirstMatch = cleaned.match(
    /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/
  );

  if (dayFirstMatch) {
    const day = Number(dayFirstMatch[1]);
    const month = Number(dayFirstMatch[2]);
    const year = Number(dayFirstMatch[3]);
    const parsed = new Date(Date.UTC(year, month - 1, day));

    return parsed.getUTCFullYear() === year &&
      parsed.getUTCMonth() === month - 1 &&
      parsed.getUTCDate() === day
      ? parsed
      : null;
  }

  const parsed = new Date(cleaned);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

const normalizeUrl = (
  value: string | null | undefined
): string | null => {
  const cleaned = cleanString(value);

  if (!cleaned) {
    return null;
  }

  try {
    return new URL(cleaned).toString();
  } catch {
    return null;
  }
};

export const normalizeOpportunity = (
  input: ExtractedOpportunity
): NormalizedOpportunity => {
  const title = cleanString(input.title);

  if (!title) {
    throw new Error(
      "Cannot normalize opportunity without a title"
    );
  }

  return {
    title,

    organization: cleanString(
      input.organization
    ),

    type: input.type,

    description: cleanString(
      input.description
    ),

    officialUrl: normalizeUrl(
      input.officialUrl
    ),

    applicationUrl: normalizeUrl(
      input.applicationUrl
    ),

    location: cleanString(
      input.location
    ),

    isRemote: Boolean(input.isRemote),

    applicationStartDate: parseDate(
      input.applicationStartDate
    ),

    applicationDeadline: parseDate(
      input.applicationDeadline
    ),

    sourceName: cleanString(
      input.sourceName
    ),

    sourceUrl: input.sourceUrl,

    normalizedAt: new Date(),
  };
};
