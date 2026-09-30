import { RotateCcw } from "lucide-react";
import type {
  OpportunitySortOption,
  OpportunityStatus,
  OpportunityType,
} from "../../types/opportunity";

export interface OpportunityFilterValues {
  type: OpportunityType | "ALL";
  status: OpportunityStatus | "ALL";
  location: string;
  remote: "ALL" | "true" | "false";
  sort: OpportunitySortOption;
}

interface OpportunityFiltersProps {
  filters: OpportunityFilterValues;
  onChange: <K extends keyof OpportunityFilterValues>(
    key: K,
    value: OpportunityFilterValues[K]
  ) => void;
  onReset: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const SELECT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500";

export function OpportunityFilters({
  filters,
  onChange,
  onReset,
  mobileOpen = false,
  onCloseMobile,
}: OpportunityFiltersProps) {
  const renderPanel = (showMobileApply: boolean) => (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            Type
          </label>
          <select
            className={SELECT_CLASS}
            value={filters.type}
            onChange={(e) =>
              onChange("type", e.target.value as OpportunityFilterValues["type"])
            }
          >
            <option value="ALL">All types</option>
            <option value="EXAM">Exam</option>
            <option value="SCHOLARSHIP">Scholarship</option>
            <option value="COURSE">Course</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="CERTIFICATION">Certification</option>
            <option value="COMPETITION">Competition</option>
            <option value="RESEARCH">Research</option>
            <option value="FELLOWSHIP">Fellowship</option>
            <option value="CAREER_PROGRAM">Career Program</option>
            <option value="INTERNATIONAL">International</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            Status
          </label>
          <select
            className={SELECT_CLASS}
            value={filters.status}
            onChange={(e) =>
              onChange(
                "status",
                e.target.value as OpportunityFilterValues["status"]
              )
            }
          >
            <option value="ALL">All statuses</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="OPEN">Open</option>
            <option value="CLOSING_SOON">Closing soon</option>
            <option value="CLOSED">Closed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            Location
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="e.g. Delhi"
            className={SELECT_CLASS}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            Remote
          </label>
          <select
            className={SELECT_CLASS}
            value={filters.remote}
            onChange={(e) =>
              onChange(
                "remote",
                e.target.value as OpportunityFilterValues["remote"]
              )
            }
          >
            <option value="ALL">Any</option>
            <option value="true">Remote only</option>
            <option value="false">On-site / hybrid</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            Sort
          </label>
          <select
            className={SELECT_CLASS}
            value={filters.sort}
            onChange={(e) =>
              onChange("sort", e.target.value as OpportunityFilterValues["sort"])
            }
          >
            <option value="DEADLINE">Deadline</option>
            <option value="RECENT">Recently added</option>
            <option value="TITLE">Title</option>
          </select>
        </div>
      </div>

      {showMobileApply && onCloseMobile && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          Apply filters
        </button>
      )}
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block">{renderPanel(false)}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close filters"
            onClick={onCloseMobile}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl">
            {renderPanel(true)}
          </div>
        </div>
      )}
    </>
  );
}
