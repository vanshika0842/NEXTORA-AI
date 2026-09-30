import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import type { Opportunity } from "../../types/opportunity";
import {
  formatOpportunityDate,
  opportunityTypeLabel,
  statusBadgeClasses,
  typeBadgeClasses,
} from "../../utils/opportunityFormat";

function MetaRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-700">{value}</span>
    </div>
  );
}

function SkillChips({ skills }: { skills?: string[] }) {
  if (!skills?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.slice(0, 4).map((skill) => (
        <span
          key={skill}
          className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function TypeSpecificBody({ opportunity }: { opportunity: Opportunity }) {
  switch (opportunity.type) {
    case "EXAM": {
      const d = opportunity.examDetails;
      return (
        <div className="space-y-2">
          <MetaRow label="Conducting body" value={d?.conductingBody} />
          <MetaRow
            label="Exam date"
            value={formatOpportunityDate(d?.examDate)}
          />
          <MetaRow label="Mode" value={d?.examMode} />
          <MetaRow label="Fee" value={d?.applicationFee} />
          <MetaRow
            label="Eligibility"
            value={
              d?.eligibilityText
                ? d.eligibilityText.length > 90
                  ? `${d.eligibilityText.slice(0, 90)}…`
                  : d.eligibilityText
                : null
            }
          />
        </div>
      );
    }
    case "SCHOLARSHIP": {
      const d = opportunity.scholarshipDetails;
      return (
        <div className="space-y-2">
          <MetaRow label="Award" value={d?.awardAmount} />
          <MetaRow label="Award type" value={d?.awardType} />
          <MetaRow label="Academic req." value={d?.academicRequirement} />
          <MetaRow label="Category" value={d?.categoryRequirement} />
        </div>
      );
    }
    case "COURSE": {
      const d = opportunity.courseDetails;
      return (
        <div className="space-y-2">
          <MetaRow label="Duration" value={d?.duration} />
          <MetaRow label="Level" value={d?.level} />
          <MetaRow label="Mode" value={d?.mode} />
          <MetaRow label="Price" value={d?.price} />
          <MetaRow
            label="Certificate"
            value={d ? (d.certificate ? "Yes" : "No") : null}
          />
          <MetaRow
            label="Rating"
            value={d?.rating != null ? String(d.rating) : null}
          />
          <SkillChips skills={d?.skills} />
        </div>
      );
    }
    case "INTERNSHIP": {
      const d = opportunity.internshipDetails;
      return (
        <div className="space-y-2">
          <MetaRow label="Role" value={d?.role} />
          <MetaRow label="Duration" value={d?.duration} />
          <MetaRow label="Stipend" value={d?.stipend} />
          <MetaRow label="Work mode" value={d?.workMode} />
          <MetaRow label="Experience" value={d?.experienceLevel} />
          <SkillChips skills={d?.skills} />
        </div>
      );
    }
    case "CERTIFICATION": {
      const d = opportunity.certificationDetails;
      return (
        <div className="space-y-2">
          <MetaRow label="Provider" value={d?.provider} />
          <MetaRow label="Level" value={d?.level} />
          <MetaRow label="Duration" value={d?.duration} />
          <MetaRow label="Price" value={d?.price} />
          <MetaRow label="Certificate" value={d?.certificateType} />
          <SkillChips skills={d?.skills} />
        </div>
      );
    }
    case "COMPETITION": {
      const d = opportunity.competitionDetails;
      return (
        <div className="space-y-2">
          <MetaRow
            label="Competition date"
            value={formatOpportunityDate(d?.competitionDate)}
          />
          <MetaRow
            label="Registration"
            value={formatOpportunityDate(d?.registrationDeadline)}
          />
          <MetaRow
            label="Team"
            value={
              d
                ? d.teamBased
                  ? `Team${d.teamSize ? ` · ${d.teamSize}` : ""}`
                  : "Individual"
                : null
            }
          />
          <MetaRow label="Prize" value={d?.prizeDetails} />
          <MetaRow label="Mode" value={d?.participationMode} />
        </div>
      );
    }
    case "RESEARCH": {
      const d = opportunity.researchDetails;
      return (
        <div className="space-y-2">
          <MetaRow label="Area" value={d?.researchArea} />
          <MetaRow label="Duration" value={d?.duration} />
          <MetaRow label="Stipend" value={d?.stipend} />
          <MetaRow
            label="Faculty required"
            value={d ? (d.facultyRequired ? "Yes" : "No") : null}
          />
          <SkillChips skills={d?.skills} />
        </div>
      );
    }
    case "FELLOWSHIP": {
      const d = opportunity.fellowshipDetails;
      return (
        <div className="space-y-2">
          <MetaRow label="Duration" value={d?.duration} />
          <MetaRow label="Stipend" value={d?.stipend} />
          <MetaRow label="Amount" value={d?.fellowshipAmount} />
          <MetaRow
            label="Eligibility"
            value={
              d?.eligibilityText
                ? d.eligibilityText.length > 90
                  ? `${d.eligibilityText.slice(0, 90)}…`
                  : d.eligibilityText
                : null
            }
          />
        </div>
      );
    }
    default:
      return (
        <div className="space-y-2">
          <MetaRow
            label="Location"
            value={
              opportunity.isRemote
                ? opportunity.location
                  ? `Remote · ${opportunity.location}`
                  : "Remote"
                : opportunity.location
            }
          />
        </div>
      );
  }
}

function ctaLabel(type: Opportunity["type"]) {
  switch (type) {
    case "EXAM":
      return "View Exam";
    case "SCHOLARSHIP":
      return "View Scholarship";
    case "COURSE":
      return "View Course";
    case "INTERNSHIP":
      return "View Internship";
    case "CERTIFICATION":
      return "View Certification";
    case "COMPETITION":
      return "View Competition";
    case "RESEARCH":
      return "View Research";
    case "FELLOWSHIP":
      return "View Fellowship";
    default:
      return "View Details";
  }
}

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${typeBadgeClasses(opportunity.type)}`}
          >
            {opportunityTypeLabel(opportunity.type)}
          </span>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            title="Saved opportunities coming soon"
            aria-label="Save opportunity (coming soon)"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {opportunity.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{opportunity.organization}</p>
        </div>

        <TypeSpecificBody opportunity={opportunity} />

        <div className="space-y-2 border-t border-slate-100 pt-3">
          <MetaRow
            label="Deadline"
            value={
              formatOpportunityDate(opportunity.applicationDeadline) ??
              "Not announced"
            }
          />
          {(opportunity.location || opportunity.isRemote) && (
            <MetaRow
              label="Location"
              value={
                opportunity.isRemote
                  ? opportunity.location
                    ? `Remote · ${opportunity.location}`
                    : "Remote"
                  : opportunity.location
              }
            />
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${statusBadgeClasses(opportunity.status)}`}
        >
          {opportunity.status.replaceAll("_", " ")}
        </span>
        <Link
          to={`/opportunities/${opportunity.id}`}
          className="inline-flex items-center rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          {ctaLabel(opportunity.type)}
        </Link>
      </div>
    </article>
  );
}
