import type {
  OpportunityStatus,
  OpportunityType,
} from "../generated/prisma/enums";

export type OpportunitySortOption = "DEADLINE" | "RECENT" | "TITLE";

export interface OpportunityListQuery {
  search?: string;
  type?: OpportunityType;
  status?: OpportunityStatus;
  location?: string;
  remote?: boolean;
  sort: OpportunitySortOption;
  page: number;
  limit: number;
}

export interface OpportunityPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Concise card-oriented opportunity payload for list endpoints. */
export interface OpportunityListItem {
  id: number;
  title: string;
  organization: string;
  type: OpportunityType;
  description: string | null;
  location: string | null;
  isRemote: boolean;
  applicationStartDate: Date | null;
  applicationDeadline: Date | null;
  /** Effective status derived from dates (not mutated in DB). */
  status: OpportunityStatus;
  sourceName: string | null;
  lastVerifiedAt: Date | null;
  createdAt: Date;
  examDetails?: unknown;
  scholarshipDetails?: unknown;
  courseDetails?: unknown;
  internshipDetails?: unknown;
  certificationDetails?: unknown;
  competitionDetails?: unknown;
  researchDetails?: unknown;
  fellowshipDetails?: unknown;
}

/** Full opportunity payload for detail endpoint. */
export interface OpportunityDetail extends OpportunityListItem {
  officialUrl: string | null;
  applicationUrl: string | null;
  sourceUrl: string | null;
  updatedAt: Date;
}
