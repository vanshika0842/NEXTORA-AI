
import {
  OpportunityStatus,
} from "../generated/prisma/enums";

/**
 * CLOSING_SOON threshold: deadline is within the next 7 days (inclusive),
 * and has not yet passed.
 */
export const CLOSING_SOON_THRESHOLD_DAYS = 7;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Compute effective opportunity status from dates.
 *
 * Rules (deterministic, read-only — never mutates the DB):
 * 1. If configured status is ARCHIVED → ARCHIVED
 * 2. If applicationStartDate is in the future → UPCOMING
 * 3. If applicationDeadline has passed → CLOSED
 * 4. If applicationDeadline is within CLOSING_SOON_THRESHOLD_DAYS → CLOSING_SOON
 * 5. If there is no applicable deadline → retain configured status
 * 6. Otherwise (open window, deadline farther out) → OPEN
 */
export function getEffectiveOpportunityStatus(input: {
  status: OpportunityStatus;
  applicationStartDate: Date | null;
  applicationDeadline: Date | null;
  now?: Date;
}): OpportunityStatus {
  const now = input.now ?? new Date();
  const { status, applicationStartDate, applicationDeadline } = input;

  if (status === OpportunityStatus.ARCHIVED) {
    return OpportunityStatus.ARCHIVED;
  }

  if (applicationStartDate && applicationStartDate.getTime() > now.getTime()) {
    return OpportunityStatus.UPCOMING;
  }

  if (!applicationDeadline) {
    // No applicable deadline — keep the configured/stored status.
    return status;
  }

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const deadlineDay = new Date(applicationDeadline);
  deadlineDay.setHours(0, 0, 0, 0);

  if (deadlineDay.getTime() < today.getTime()) {
    return OpportunityStatus.CLOSED;
  }

  const closingSoonEnd =
    today.getTime() + (CLOSING_SOON_THRESHOLD_DAYS + 1) * MS_PER_DAY;

  if (deadlineDay.getTime() < closingSoonEnd) {
    return OpportunityStatus.CLOSING_SOON;
  }

  return OpportunityStatus.OPEN;
}
