import {
  OpportunityStatus,
  OpportunityType,
} from "../generated/prisma/enums";
import type {
  OpportunityListQuery,
  OpportunitySortOption,
} from "../types/opportunity.types";

export class OpportunityValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "OpportunityValidationError";
    this.statusCode = statusCode;
  }
}

const OPPORTUNITY_TYPES = new Set<string>(Object.values(OpportunityType));
const OPPORTUNITY_STATUSES = new Set<string>(
  Object.values(OpportunityStatus)
);
const SORT_OPTIONS = new Set<OpportunitySortOption>([
  "DEADLINE",
  "RECENT",
  "TITLE",
]);

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value !== "string") {
    return String(value);
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parsePositiveInt(
  value: unknown,
  field: string,
  fallback: number
): number {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value !== "string" && typeof value !== "number") {
    throw new OpportunityValidationError(`Invalid ${field}`);
  }

  const raw = String(value).trim();
  if (!/^\d+$/.test(raw)) {
    throw new OpportunityValidationError(`Invalid ${field}`);
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new OpportunityValidationError(`Invalid ${field}`);
  }

  return parsed;
}

function parseRemote(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }

  throw new OpportunityValidationError(
    'Invalid remote value. Use "true" or "false".'
  );
}

function parseType(value: unknown): OpportunityType | undefined {
  const raw = asOptionalString(value);
  if (!raw) {
    return undefined;
  }

  if (!OPPORTUNITY_TYPES.has(raw)) {
    throw new OpportunityValidationError(
      `Invalid type. Allowed values: ${Array.from(OPPORTUNITY_TYPES).join(", ")}`
    );
  }

  return raw as OpportunityType;
}

function parseStatus(value: unknown): OpportunityStatus | undefined {
  const raw = asOptionalString(value);
  if (!raw) {
    return undefined;
  }

  if (!OPPORTUNITY_STATUSES.has(raw)) {
    throw new OpportunityValidationError(
      `Invalid status. Allowed values: ${Array.from(OPPORTUNITY_STATUSES).join(", ")}`
    );
  }

  return raw as OpportunityStatus;
}

function parseSort(value: unknown): OpportunitySortOption {
  const raw = asOptionalString(value);
  if (!raw) {
    // Default: upcoming deadlines first — best for discovery.
    return "DEADLINE";
  }

  if (!SORT_OPTIONS.has(raw as OpportunitySortOption)) {
    throw new OpportunityValidationError(
      'Invalid sort. Allowed values: DEADLINE, RECENT, TITLE'
    );
  }

  return raw as OpportunitySortOption;
}

export function parseOpportunityListQuery(
  query: Record<string, unknown>
): OpportunityListQuery {
  const page = parsePositiveInt(query.page, "page", DEFAULT_PAGE);
  const limit = parsePositiveInt(query.limit, "limit", DEFAULT_LIMIT);

  if (limit > MAX_LIMIT) {
    throw new OpportunityValidationError(
      `Invalid limit. Maximum allowed is ${MAX_LIMIT}`
    );
  }

  return {
    search: asOptionalString(query.search),
    type: parseType(query.type),
    status: parseStatus(query.status),
    location: asOptionalString(query.location),
    remote: parseRemote(query.remote),
    sort: parseSort(query.sort),
    page,
    limit,
  };
}

export function parseOpportunityId(rawId: unknown): number {
  if (typeof rawId !== "string" && typeof rawId !== "number") {
    throw new OpportunityValidationError("Invalid opportunity ID");
  }

  const raw = String(rawId).trim();
  if (!/^\d+$/.test(raw)) {
    throw new OpportunityValidationError("Invalid opportunity ID");
  }

  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new OpportunityValidationError("Invalid opportunity ID");
  }

  return id;
}
