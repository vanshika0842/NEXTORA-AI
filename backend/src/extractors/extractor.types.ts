import type { OpportunityType } from "../generated/prisma/client";

export interface ExtractedOpportunity {
  title: string | null;
  organization: string | null;
  type: OpportunityType | null;

  description: string | null;
  eligibility: string | null;

  location: string | null;
  isRemote: boolean;

  applicationStartDate: string | null;
  applicationDeadline: string | null;

  officialUrl: string | null;
  applicationUrl: string | null;

  sourceName: string | null;
  sourceUrl: string;

  confidence: number;
}

export interface OpportunityExtractorInput {
  html: string;
  sourceUrl: string;
  sourceName?: string | null;
  officialUrl?: string | null;
}
