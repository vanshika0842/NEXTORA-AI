import prisma from "./lib/prisma";

import type { NormalizedOpportunity } from "./services/opportunity-normalization.service";

import type { ValidationResult } from "./services/opportunity-validator.service";

import { OpportunityStatus } from "./generated/prisma/client";

import {
  generateOpportunityFingerprint,
} from "./services/opportunity-fingerprint.service";

import { getEffectiveOpportunityStatus } from "./services/opportunityStatus.service";

// --------------------------------------------------
// OPPORTUNITY STATUS
// --------------------------------------------------

export function calculateOpportunityStatus(
  startDate: Date | null,
  deadline: Date | null
): OpportunityStatus {
  return getEffectiveOpportunityStatus({
    status: OpportunityStatus.OPEN,
    applicationStartDate: startDate,
    applicationDeadline: deadline,
  });
}

// --------------------------------------------------
// RESULT TYPE
// --------------------------------------------------

export interface PersistenceResult {
  success: boolean;
  action?: "CREATED" | "UPDATED";
  opportunityId?: number;
  status?: OpportunityStatus;
  message: string;
}

// --------------------------------------------------
// MAIN PERSISTENCE FUNCTION
// --------------------------------------------------

export async function persistOpportunity(
  opportunity: NormalizedOpportunity,
  validation: ValidationResult,
  fingerprint = generateOpportunityFingerprint(opportunity)
): Promise<PersistenceResult> {
  // ------------------------------------------------
  // 1. VALIDATION GATE
  // ------------------------------------------------

  if (validation.status === "INVALID") {
    return {
      success: false,
      message:
        "Opportunity was not persisted because validation failed.",
    };
  }

  if (validation.status === "REVIEW") {
    return {
      success: false,
      message:
        "Opportunity requires review and was not persisted.",
    };
  }

  if (validation.status === "EXPIRED") {
    return {
      success: false,
      message:
        "Expired opportunity was not persisted.",
    };
  }

  // ------------------------------------------------
  // 2. REQUIRED DATABASE FIELDS
  // ------------------------------------------------

  if (!opportunity.title?.trim()) {
    return {
      success: false,
      message:
        "Cannot persist opportunity without a title.",
    };
  }

  if (!opportunity.organization?.trim()) {
    return {
      success: false,
      message:
        "Cannot persist opportunity without an organization.",
    };
  }

  if (!opportunity.type) {
    return {
      success: false,
      message:
        "Cannot persist opportunity without an opportunity type.",
    };
  }

  if (!opportunity.sourceUrl?.trim()) {
    return {
      success: false,
      message:
        "Cannot persist opportunity without a source URL.",
    };
  }

  // ------------------------------------------------
  // 3. PREPARE DATES
  // ------------------------------------------------

  const applicationStartDate =
    opportunity.applicationStartDate ?? null;

  const applicationDeadline =
    opportunity.applicationDeadline ?? null;

  const status = calculateOpportunityStatus(
    applicationStartDate,
    applicationDeadline
  );

  // ------------------------------------------------
  // 4. CHECK FOR EXISTING OPPORTUNITY
  // ------------------------------------------------

  const existingOpportunity =
    await prisma.opportunity.findUnique({
      where: {
        fingerprint,
      },
    });

  // ------------------------------------------------
  // 5. UPDATE EXISTING OPPORTUNITY
  // ------------------------------------------------

  if (existingOpportunity) {
    const updatedOpportunity =
      await prisma.opportunity.update({
        where: {
          id: existingOpportunity.id,
        },

        data: {
          title: opportunity.title.trim(),

          organization:
            opportunity.organization.trim(),

          type: opportunity.type,

          fingerprint,

          description:
            opportunity.description?.trim() || null,

          officialUrl:
            opportunity.officialUrl?.trim() || null,

          applicationUrl:
            opportunity.applicationUrl?.trim() || null,

          location:
            opportunity.location?.trim() || null,

          isRemote: opportunity.isRemote,

          applicationStartDate,

          applicationDeadline,

          status,

          sourceName:
            opportunity.sourceName?.trim() || null,

          sourceUrl:
            opportunity.sourceUrl.trim(),

          lastVerifiedAt: new Date(),
        },
      });

    return {
      success: true,
      action: "UPDATED",
      opportunityId: updatedOpportunity.id,
      status: updatedOpportunity.status,
      message:
        "Existing opportunity detected and updated.",
    };
  }

  // ------------------------------------------------
  // 6. CREATE NEW OPPORTUNITY
  // ------------------------------------------------

  const createdOpportunity =
    await prisma.opportunity.create({
      data: {
        title: opportunity.title.trim(),

        organization:
          opportunity.organization.trim(),

        type: opportunity.type,

        fingerprint,

        description:
          opportunity.description?.trim() || null,

        officialUrl:
          opportunity.officialUrl?.trim() || null,

        applicationUrl:
          opportunity.applicationUrl?.trim() || null,

        location:
          opportunity.location?.trim() || null,

        isRemote: opportunity.isRemote,

        applicationStartDate,

        applicationDeadline,

        status,

        sourceName:
          opportunity.sourceName?.trim() || null,

        sourceUrl:
          opportunity.sourceUrl.trim(),

        lastVerifiedAt: new Date(),
      },
    });

  return {
    success: true,
    action: "CREATED",
    opportunityId: createdOpportunity.id,
    status: createdOpportunity.status,
    message:
      "New opportunity persisted successfully.",
  };
}
