import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { AppShell } from "../components/layout/AppShell";
import { getOpportunityById } from "../api/opportunityApi";
import type { Opportunity } from "../types/opportunity";
import {
  formatOpportunityDate,
  opportunityTypeLabel,
  statusBadgeClasses,
  typeBadgeClasses,
} from "../utils/opportunityFormat";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  if (!children) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | null;
}) {
  if (value === null || value === undefined || value === "") return null;
  const display =
    typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  return (
    <div className="grid gap-1 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-xs font-medium text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-700 whitespace-pre-wrap">{display}</dd>
    </div>
  );
}

function LinkField({ label, href }: { label: string; href?: string | null }) {
  if (!href) return null;
  return (
    <div className="grid gap-1 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-xs font-medium text-slate-400">{label}</dt>
      <dd>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Open link <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </dd>
    </div>
  );
}

function TypeSpecificSections({ opportunity }: { opportunity: Opportunity }) {
  switch (opportunity.type) {
    case "EXAM": {
      const d = opportunity.examDetails;
      if (!d) return null;
      return (
        <>
          <Section title="Important Dates">
            <div className="space-y-3">
              <Field
                label="Application start"
                value={formatOpportunityDate(opportunity.applicationStartDate)}
              />
              <Field
                label="Application deadline"
                value={formatOpportunityDate(opportunity.applicationDeadline)}
              />
              <Field
                label="Exam date"
                value={formatOpportunityDate(d.examDate)}
              />
            </div>
          </Section>
          <Section title="Exam Details">
            <div className="space-y-3">
              <Field label="Conducting body" value={d.conductingBody} />
              <Field label="Mode" value={d.examMode} />
              <Field label="Application fee" value={d.applicationFee} />
              <Field label="Age limit" value={d.ageLimit} />
              <Field label="Attempts" value={d.numberOfAttempts} />
            </div>
          </Section>
          <Section title="Eligibility">
            <p className="text-sm leading-relaxed text-slate-700">
              {d.eligibilityText || "See official notification for eligibility."}
            </p>
          </Section>
          <Section title="Official Resources">
            <div className="space-y-3">
              <LinkField label="Syllabus" href={d.syllabusUrl} />
              <LinkField label="Notification" href={d.notificationUrl} />
            </div>
          </Section>
        </>
      );
    }
    case "SCHOLARSHIP": {
      const d = opportunity.scholarshipDetails;
      if (!d) return null;
      return (
        <>
          <Section title="Award">
            <div className="space-y-3">
              <Field label="Amount" value={d.awardAmount} />
              <Field label="Award type" value={d.awardType} />
              <Field label="Benefits" value={d.benefits} />
            </div>
          </Section>
          <Section title="Eligibility">
            <div className="space-y-3">
              <Field label="Academic requirement" value={d.academicRequirement} />
              <Field label="Income limit" value={d.incomeLimit} />
              <Field label="Category" value={d.categoryRequirement} />
            </div>
          </Section>
          <Section title="Required Documents">
            <p className="text-sm leading-relaxed text-slate-700">
              {d.requiredDocuments || "Check the official application page."}
            </p>
          </Section>
        </>
      );
    }
    case "COURSE": {
      const d = opportunity.courseDetails;
      if (!d) return null;
      return (
        <Section title="Course Details">
          <div className="space-y-3">
            <Field label="Duration" value={d.duration} />
            <Field label="Level" value={d.level} />
            <Field label="Mode" value={d.mode} />
            <Field label="Price" value={d.price} />
            <Field label="Rating" value={d.rating} />
            <Field label="Certificate" value={d.certificate} />
            <Field
              label="Start date"
              value={formatOpportunityDate(d.startDate)}
            />
            <Field
              label="Skills"
              value={d.skills?.length ? d.skills.join(", ") : null}
            />
          </div>
        </Section>
      );
    }
    case "INTERNSHIP": {
      const d = opportunity.internshipDetails;
      if (!d) return null;
      return (
        <Section title="Internship Details">
          <div className="space-y-3">
            <Field label="Role" value={d.role} />
            <Field label="Duration" value={d.duration} />
            <Field label="Stipend" value={d.stipend} />
            <Field label="Work mode" value={d.workMode} />
            <Field label="Experience" value={d.experienceLevel} />
            <Field
              label="Start date"
              value={formatOpportunityDate(d.startDate)}
            />
            <Field
              label="Skills"
              value={d.skills?.length ? d.skills.join(", ") : null}
            />
          </div>
        </Section>
      );
    }
    case "CERTIFICATION": {
      const d = opportunity.certificationDetails;
      if (!d) return null;
      return (
        <Section title="Certification Details">
          <div className="space-y-3">
            <Field label="Provider" value={d.provider} />
            <Field label="Level" value={d.level} />
            <Field label="Duration" value={d.duration} />
            <Field label="Price" value={d.price} />
            <Field label="Certificate type" value={d.certificateType} />
            <Field
              label="Skills"
              value={d.skills?.length ? d.skills.join(", ") : null}
            />
          </div>
        </Section>
      );
    }
    case "COMPETITION": {
      const d = opportunity.competitionDetails;
      if (!d) return null;
      return (
        <Section title="Competition Details">
          <div className="space-y-3">
            <Field
              label="Competition date"
              value={formatOpportunityDate(d.competitionDate)}
            />
            <Field
              label="Registration deadline"
              value={formatOpportunityDate(d.registrationDeadline)}
            />
            <Field label="Team based" value={d.teamBased} />
            <Field label="Team size" value={d.teamSize} />
            <Field label="Prize" value={d.prizeDetails} />
            <Field label="Mode" value={d.participationMode} />
            <Field
              label="Themes"
              value={d.themes?.length ? d.themes.join(", ") : null}
            />
          </div>
        </Section>
      );
    }
    case "RESEARCH": {
      const d = opportunity.researchDetails;
      if (!d) return null;
      return (
        <>
          <Section title="Research Details">
            <div className="space-y-3">
              <Field label="Area" value={d.researchArea} />
              <Field label="Duration" value={d.duration} />
              <Field label="Stipend" value={d.stipend} />
              <Field label="Faculty required" value={d.facultyRequired} />
              <Field
                label="Skills"
                value={d.skills?.length ? d.skills.join(", ") : null}
              />
            </div>
          </Section>
          <Section title="Eligibility">
            <p className="text-sm leading-relaxed text-slate-700">
              {d.eligibilityText || "See official listing for eligibility."}
            </p>
          </Section>
        </>
      );
    }
    case "FELLOWSHIP": {
      const d = opportunity.fellowshipDetails;
      if (!d) return null;
      return (
        <>
          <Section title="Fellowship Details">
            <div className="space-y-3">
              <Field label="Duration" value={d.duration} />
              <Field label="Stipend" value={d.stipend} />
              <Field label="Amount" value={d.fellowshipAmount} />
              <Field label="Benefits" value={d.benefits} />
            </div>
          </Section>
          <Section title="Eligibility">
            <p className="text-sm leading-relaxed text-slate-700">
              {d.eligibilityText || "See official listing for eligibility."}
            </p>
          </Section>
        </>
      );
    }
    default:
      return null;
  }
}

export default function OpportunityDetail() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) {
        setError("Invalid opportunity ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getOpportunityById(id);
        if (!cancelled) setOpportunity(data);
      } catch (err: unknown) {
        console.error(err);
        if (!cancelled) {
          const status =
            typeof err === "object" &&
            err &&
            "response" in err &&
            typeof (err as { response?: { status?: number } }).response
              ?.status === "number"
              ? (err as { response: { status: number } }).response.status
              : null;
          setError(
            status === 404
              ? "Opportunity not found"
              : "Failed to load opportunity"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <AppShell activeNav="opportunities" breadcrumb="Opportunity details">
      <div className="mx-auto max-w-4xl space-y-5">
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Opportunity Finder
        </Link>

        {loading && (
          <div className="animate-pulse space-y-4">
            <div className="h-40 rounded-2xl border border-slate-200 bg-white" />
            <div className="h-48 rounded-2xl border border-slate-200 bg-white" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center">
            <h2 className="text-base font-semibold text-slate-900">{error}</h2>
            <Link
              to="/opportunities"
              className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Browse opportunities
            </Link>
          </div>
        )}

        {!loading && opportunity && (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${typeBadgeClasses(opportunity.type)}`}
                >
                  {opportunityTypeLabel(opportunity.type)}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${statusBadgeClasses(opportunity.status)}`}
                >
                  {opportunity.status.replaceAll("_", " ")}
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold text-slate-900">
                {opportunity.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {opportunity.organization}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                {(opportunity.location || opportunity.isRemote) && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {opportunity.isRemote
                      ? opportunity.location
                        ? `Remote · ${opportunity.location}`
                        : "Remote"
                      : opportunity.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Deadline:{" "}
                  {formatOpportunityDate(opportunity.applicationDeadline) ??
                    "Not announced"}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {opportunity.applicationUrl && (
                  <a
                    href={opportunity.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Apply / Official application
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {opportunity.officialUrl && (
                  <a
                    href={opportunity.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Official website
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </section>

            <Section title="Overview">
              <p className="text-sm leading-relaxed text-slate-700">
                {opportunity.description || "No description available."}
              </p>
            </Section>

            <TypeSpecificSections opportunity={opportunity} />

            <Section title="Source & Verification">
              <div className="space-y-3">
                <Field label="Source" value={opportunity.sourceName} />
                <LinkField label="Source URL" href={opportunity.sourceUrl} />
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>
                    Last verified:{" "}
                    {formatOpportunityDate(opportunity.lastVerifiedAt) ??
                      "Not available"}
                  </span>
                </div>
              </div>
            </Section>
          </>
        )}
      </div>
    </AppShell>
  );
}
