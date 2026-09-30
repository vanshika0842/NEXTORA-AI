import type { OpportunityStatus, OpportunityType } from "../types/opportunity";

export function formatOpportunityDate(
  value?: string | Date | null
): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function opportunityTypeLabel(type: OpportunityType): string {
  return type.replaceAll("_", " ");
}

export function statusBadgeClasses(status: OpportunityStatus): string {
  switch (status) {
    case "OPEN":
      return "bg-emerald-50 text-emerald-700";
    case "CLOSING_SOON":
      return "bg-amber-50 text-amber-700";
    case "UPCOMING":
      return "bg-blue-50 text-blue-700";
    case "CLOSED":
      return "bg-slate-100 text-slate-600";
    case "ARCHIVED":
      return "bg-slate-100 text-slate-500";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function typeBadgeClasses(type: OpportunityType): string {
  switch (type) {
    case "EXAM":
      return "bg-indigo-50 text-indigo-700";
    case "SCHOLARSHIP":
      return "bg-emerald-50 text-emerald-700";
    case "COURSE":
      return "bg-sky-50 text-sky-700";
    case "INTERNSHIP":
      return "bg-violet-50 text-violet-700";
    case "CERTIFICATION":
      return "bg-cyan-50 text-cyan-700";
    case "COMPETITION":
      return "bg-orange-50 text-orange-700";
    case "RESEARCH":
      return "bg-teal-50 text-teal-700";
    case "FELLOWSHIP":
      return "bg-fuchsia-50 text-fuchsia-700";
    case "CAREER_PROGRAM":
      return "bg-blue-50 text-blue-700";
    case "INTERNATIONAL":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function truncateText(value: string | null | undefined, max = 140) {
  if (!value) return null;
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}…`;
}
