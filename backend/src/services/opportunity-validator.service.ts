import type { NormalizedOpportunity } from "./opportunity-normalization.service";

export type ValidationStatus =
  | "VALID"
  | "REVIEW"
  | "INVALID"
  | "EXPIRED";

export interface ValidationResult {
  valid: boolean;
  status: ValidationStatus;
  errors: string[];
  warnings: string[];
  score: number;
}

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function toDate(value: Date | string | null): Date | null {
  if (!value) {
    return null;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function isValidDate(
  value: Date | string | null
): boolean {
  return toDate(value) !== null;
}

function isPastDate(
  value: Date | string | null
): boolean {
  const date = toDate(value);

  if (!date) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);

  return candidate.getTime() < today.getTime();
}

function isValidUrl(value: string | null): boolean {
  if (!value?.trim()) {
    return false;
  }

  try {
    const url = new URL(value.trim());

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

// --------------------------------------------------
// MAIN VALIDATOR
// --------------------------------------------------

export function validateOpportunity(
  opportunity: NormalizedOpportunity
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ------------------------------------------------
  // 1. REQUIRED FIELDS
  // ------------------------------------------------

  if (!opportunity.title.trim()) {
    errors.push("Missing opportunity title");
  }

  if (!opportunity.organization?.trim()) {
    errors.push("Missing organization");
  }

  if (!opportunity.type) {
    errors.push("Missing opportunity type");
  }

  if (!opportunity.sourceUrl?.trim()) {
    errors.push("Missing source URL");
  }

  // ------------------------------------------------
  // 2. CONTENT QUALITY
  // ------------------------------------------------

  if (!opportunity.description?.trim()) {
    warnings.push("Missing description");
  }

  if (!opportunity.location?.trim()) {
    warnings.push("Missing location");
  }

  if (!opportunity.sourceName?.trim()) {
    warnings.push("Missing source name");
  }

  if (!opportunity.officialUrl?.trim()) {
    warnings.push("Missing official URL");
  }

  if (!opportunity.applicationUrl?.trim()) {
    warnings.push("Missing application URL");
  }

  // ------------------------------------------------
  // 3. DATE VALIDATION
  // ------------------------------------------------

  if (!opportunity.applicationStartDate) {
    warnings.push("Missing application start date");
  } else if (
    !isValidDate(opportunity.applicationStartDate)
  ) {
    errors.push("Invalid application start date");
  }

  if (!opportunity.applicationDeadline) {
    warnings.push("Missing application deadline");
  } else if (
    !isValidDate(opportunity.applicationDeadline)
  ) {
    errors.push("Invalid application deadline");
  }

  // ------------------------------------------------
  // 4. DATE RELATIONSHIP
  // ------------------------------------------------

  if (
    isValidDate(opportunity.applicationStartDate) &&
    isValidDate(opportunity.applicationDeadline)
  ) {
    const start = toDate(
  opportunity.applicationStartDate
  )!.getTime();

   const deadline = toDate(
  opportunity.applicationDeadline
   )!.getTime();

    if (deadline < start) {
      errors.push(
        "Application deadline cannot be earlier than application start date"
      );
    }
  }

  // ------------------------------------------------
  // 5. URL VALIDATION
  // ------------------------------------------------

  if (opportunity.sourceUrl?.trim()) {
    if (!isValidUrl(opportunity.sourceUrl)) {
      errors.push("Invalid source URL");
    }
  }

  if (opportunity.officialUrl?.trim()) {
    if (!isValidUrl(opportunity.officialUrl)) {
      errors.push("Invalid official URL");
    }
  }

  if (opportunity.applicationUrl?.trim()) {
    if (!isValidUrl(opportunity.applicationUrl)) {
      errors.push("Invalid application URL");
    }
  }

  // ------------------------------------------------
  // 6. APPLICATION STATUS
  // ------------------------------------------------

  const startDate = toDate(
  opportunity.applicationStartDate
);

const deadlineDate = toDate(
  opportunity.applicationDeadline
);

if (
  deadlineDate &&
  isPastDate(deadlineDate) &&
  !errors.some((error) =>
    error.includes(
      "deadline cannot be earlier"
    )
  )
) {
  warnings.push(
    "Opportunity deadline has already passed"
  );
}
  // ------------------------------------------------
  // 7. QUALITY SCORE
  // ------------------------------------------------

  const totalChecks = 12;

  const failedChecks = Math.min(
    errors.length + warnings.length,
    totalChecks
  );

  const score = Math.max(
    0,
    Math.round(
      ((totalChecks - failedChecks) /
        totalChecks) *
        100
    )
  );

  // ------------------------------------------------
  // 8. FINAL STATUS
  // ------------------------------------------------

  let status: ValidationStatus;

  if (errors.length > 0) {
    status = "INVALID";
  } else if (
    deadlineDate &&
    isPastDate(deadlineDate)
  ) {
    status = "EXPIRED";
  } else if (warnings.length > 0) {
    status = "REVIEW";
  } else {
    status = "VALID";
  }

  return {
    valid: errors.length === 0,
    status,
    errors,
    warnings,
    score,
  };
}
