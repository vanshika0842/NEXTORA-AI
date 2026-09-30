import type { Prisma } from "../generated/prisma/client";
import {
  OpportunityStatus,
  OpportunityType,
} from "../generated/prisma/enums";
import prisma from "../lib/prisma";
import type {
  OpportunityDetail,
  OpportunityListItem,
  OpportunityListQuery,
  OpportunityPagination,
  OpportunitySortOption,
} from "../types/opportunity.types";
import {
  CLOSING_SOON_THRESHOLD_DAYS,
  getEffectiveOpportunityStatus,
} from "./opportunityStatus.service";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const detailInclude = {
  examDetails: true,
  scholarshipDetails: true,
  courseDetails: true,
  internshipDetails: true,
  certificationDetails: true,
  competitionDetails: true,
  researchDetails: true,
  fellowshipDetails: true,
} satisfies Prisma.OpportunityInclude;

type OpportunityWithDetails = Prisma.OpportunityGetPayload<{
  include: typeof detailInclude;
}>;

/**
 * Build a Prisma where clause that approximates effective status using dates,
 * so status filters stay database-level (no full-table load).
 *
 * ARCHIVED always uses the stored status.
 * Other statuses combine date windows with stored status only when dates
 * cannot decide (e.g. missing deadline → retain configured status).
 */
function buildStatusWhere(
  status: OpportunityStatus,
  now: Date
): Prisma.OpportunityWhereInput {
  const closingSoonEnd = new Date(
    now.getTime() + CLOSING_SOON_THRESHOLD_DAYS * MS_PER_DAY
  );

  if (status === OpportunityStatus.ARCHIVED) {
    return { status: OpportunityStatus.ARCHIVED };
  }

  const notArchived: Prisma.OpportunityWhereInput = {
    status: { not: OpportunityStatus.ARCHIVED },
  };

  switch (status) {
    case OpportunityStatus.UPCOMING:
      return {
        AND: [
          notArchived,
          {
            OR: [
              { applicationStartDate: { gt: now } },
              {
                AND: [
                  { applicationStartDate: null },
                  { applicationDeadline: null },
                  { status: OpportunityStatus.UPCOMING },
                ],
              },
            ],
          },
        ],
      };

    case OpportunityStatus.CLOSED:
      return {
        AND: [
          notArchived,
          {
            OR: [
              { applicationDeadline: { lt: now } },
              {
                AND: [
                  { applicationDeadline: null },
                  { status: OpportunityStatus.CLOSED },
                ],
              },
            ],
          },
        ],
      };

    case OpportunityStatus.CLOSING_SOON:
      return {
        AND: [
          notArchived,
          {
            OR: [
              { applicationStartDate: null },
              { applicationStartDate: { lte: now } },
            ],
          },
          {
            applicationDeadline: {
              gte: now,
              lte: closingSoonEnd,
            },
          },
        ],
      };

    case OpportunityStatus.OPEN:
      return {
        AND: [
          notArchived,
          {
            OR: [
              { applicationStartDate: null },
              { applicationStartDate: { lte: now } },
            ],
          },
          {
            OR: [
              {
                applicationDeadline: { gt: closingSoonEnd },
              },
              {
                AND: [
                  { applicationDeadline: null },
                  { status: OpportunityStatus.OPEN },
                ],
              },
            ],
          },
        ],
      };

    default:
      return { status };
  }
}

function buildWhere(
  query: OpportunityListQuery,
  now: Date
): Prisma.OpportunityWhereInput {
  const where: Prisma.OpportunityWhereInput = {};
  const and: Prisma.OpportunityWhereInput[] = [];

  if (query.search) {
    and.push({
      OR: [
        { title: { contains: query.search, mode: "insensitive" } },
        { organization: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ],
    });
  }

  if (query.type) {
    and.push({ type: query.type });
  }

  if (query.status) {
    and.push(buildStatusWhere(query.status, now));
  }

  if (query.location) {
    and.push({
      location: { contains: query.location, mode: "insensitive" },
    });
  }

  if (query.remote !== undefined) {
    and.push({ isRemote: query.remote });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  return where;
}

function buildOrderBy(
  sort: OpportunitySortOption
): Prisma.OpportunityOrderByWithRelationInput[] {
  switch (sort) {
    case "TITLE":
      return [{ title: "asc" }, { id: "asc" }];
    case "RECENT":
      return [{ createdAt: "desc" }, { id: "desc" }];
    case "DEADLINE":
    default:
      return [
        { applicationDeadline: { sort: "asc", nulls: "last" } },
        { createdAt: "desc" },
        { id: "asc" },
      ];
  }
}

function attachTypeSpecificDetails(
  opportunity: OpportunityWithDetails
): Partial<
  Pick<
    OpportunityListItem,
    | "examDetails"
    | "scholarshipDetails"
    | "courseDetails"
    | "internshipDetails"
    | "certificationDetails"
    | "competitionDetails"
    | "researchDetails"
    | "fellowshipDetails"
  >
> {
  switch (opportunity.type) {
    case OpportunityType.EXAM:
      return opportunity.examDetails
        ? { examDetails: opportunity.examDetails }
        : {};
    case OpportunityType.SCHOLARSHIP:
      return opportunity.scholarshipDetails
        ? { scholarshipDetails: opportunity.scholarshipDetails }
        : {};
    case OpportunityType.COURSE:
      return opportunity.courseDetails
        ? { courseDetails: opportunity.courseDetails }
        : {};
    case OpportunityType.INTERNSHIP:
      return opportunity.internshipDetails
        ? { internshipDetails: opportunity.internshipDetails }
        : {};
    case OpportunityType.CERTIFICATION:
      return opportunity.certificationDetails
        ? { certificationDetails: opportunity.certificationDetails }
        : {};
    case OpportunityType.COMPETITION:
      return opportunity.competitionDetails
        ? { competitionDetails: opportunity.competitionDetails }
        : {};
    case OpportunityType.RESEARCH:
      return opportunity.researchDetails
        ? { researchDetails: opportunity.researchDetails }
        : {};
    case OpportunityType.FELLOWSHIP:
      return opportunity.fellowshipDetails
        ? { fellowshipDetails: opportunity.fellowshipDetails }
        : {};
    case OpportunityType.CAREER_PROGRAM:
    case OpportunityType.INTERNATIONAL:
    default:
      // No type-specific detail tables for these types in the schema.
      return {};
  }
}

function toListItem(opportunity: OpportunityWithDetails): OpportunityListItem {
  const status = getEffectiveOpportunityStatus({
    status: opportunity.status,
    applicationStartDate: opportunity.applicationStartDate,
    applicationDeadline: opportunity.applicationDeadline,
  });

  return {
    id: opportunity.id,
    title: opportunity.title,
    organization: opportunity.organization,
    type: opportunity.type,
    description: opportunity.description,
    location: opportunity.location,
    isRemote: opportunity.isRemote,
    applicationStartDate: opportunity.applicationStartDate,
    applicationDeadline: opportunity.applicationDeadline,
    status,
    sourceName: opportunity.sourceName,
    lastVerifiedAt: opportunity.lastVerifiedAt,
    createdAt: opportunity.createdAt,
    ...attachTypeSpecificDetails(opportunity),
  };
}

function toDetail(opportunity: OpportunityWithDetails): OpportunityDetail {
  return {
    ...toListItem(opportunity),
    officialUrl: opportunity.officialUrl,
    applicationUrl: opportunity.applicationUrl,
    sourceUrl: opportunity.sourceUrl,
    updatedAt: opportunity.updatedAt,
  };
}

export async function listOpportunities(
  query: OpportunityListQuery
): Promise<{
  data: OpportunityListItem[];
  pagination: OpportunityPagination;
}> {
  const now = new Date();
  const where = buildWhere(query, now);
  const skip = (query.page - 1) * query.limit;

  const [total, rows] = await Promise.all([
    prisma.opportunity.count({ where }),
    prisma.opportunity.findMany({
      where,
      include: detailInclude,
      orderBy: buildOrderBy(query.sort),
      skip,
      take: query.limit,
    }),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / query.limit);

  return {
    data: rows.map(toListItem),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    },
  };
}

export async function getOpportunityById(
  id: number
): Promise<OpportunityDetail | null> {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: detailInclude,
  });

  if (!opportunity) {
    return null;
  }

  return toDetail(opportunity);
}
