import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "../components/layout/AppShell";
import { getOpportunities } from "../api/opportunityApi";
import { OpportunityCard } from "../components/opportunities/OpportunityCard";
import { OpportunityCategories } from "../components/opportunities/OpportunityCategories";
import { OpportunitySearch } from "../components/opportunities/OpportunitySearch";
import {
  OpportunityFilters,
  type OpportunityFilterValues,
} from "../components/opportunities/OpportunityFilters";
import {
  OpportunityEmptyState,
  OpportunityErrorState,
  OpportunitySkeleton,
} from "../components/opportunities/OpportunityStates";
import type {
  Opportunity,
  OpportunityPagination,
  OpportunitySortOption,
  OpportunityStatus,
  OpportunityType,
} from "../types/opportunity";

const DEFAULT_LIMIT = 12;

const VALID_TYPES = new Set([
  "EXAM",
  "SCHOLARSHIP",
  "COURSE",
  "INTERNSHIP",
  "CERTIFICATION",
  "COMPETITION",
  "RESEARCH",
  "FELLOWSHIP",
  "CAREER_PROGRAM",
  "INTERNATIONAL",
]);

const VALID_STATUSES = new Set([
  "UPCOMING",
  "OPEN",
  "CLOSING_SOON",
  "CLOSED",
  "ARCHIVED",
]);

const VALID_SORTS = new Set(["DEADLINE", "RECENT", "TITLE"]);

function parseFilters(params: URLSearchParams): OpportunityFilterValues & {
  search: string;
  page: number;
} {
  const typeRaw = params.get("type") || "ALL";
  const statusRaw = params.get("status") || "ALL";
  const sortRaw = params.get("sort") || "DEADLINE";
  const remoteRaw = params.get("remote") || "ALL";
  const pageRaw = Number(params.get("page") || "1");

  return {
    search: params.get("search") || "",
    type:
      typeRaw === "ALL" || !VALID_TYPES.has(typeRaw)
        ? "ALL"
        : (typeRaw as OpportunityType),
    status:
      statusRaw === "ALL" || !VALID_STATUSES.has(statusRaw)
        ? "ALL"
        : (statusRaw as OpportunityStatus),
    location: params.get("location") || "",
    remote:
      remoteRaw === "true" || remoteRaw === "false" ? remoteRaw : "ALL",
    sort: VALID_SORTS.has(sortRaw)
      ? (sortRaw as OpportunitySortOption)
      : "DEADLINE",
    page: Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1,
  };
}

function buildSearchParams(state: {
  search: string;
  type: OpportunityType | "ALL";
  status: OpportunityStatus | "ALL";
  location: string;
  remote: "ALL" | "true" | "false";
  sort: OpportunitySortOption;
  page: number;
}) {
  const next = new URLSearchParams();
  if (state.search.trim()) next.set("search", state.search.trim());
  if (state.type !== "ALL") next.set("type", state.type);
  if (state.status !== "ALL") next.set("status", state.status);
  if (state.location.trim()) next.set("location", state.location.trim());
  if (state.remote !== "ALL") next.set("remote", state.remote);
  if (state.sort !== "DEADLINE") next.set("sort", state.sort);
  if (state.page > 1) next.set("page", String(state.page));
  return next;
}

export default function Opportunities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [locationInput, setLocationInput] = useState(filters.location);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [pagination, setPagination] = useState<OpportunityPagination>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    setLocationInput(filters.location);
  }, [filters.location]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput === filters.search) return;
      setSearchParams(
        buildSearchParams({ ...filters, search: searchInput, page: 1 }),
        { replace: true }
      );
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput, filters, setSearchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (locationInput === filters.location) return;
      setSearchParams(
        buildSearchParams({ ...filters, location: locationInput, page: 1 }),
        { replace: true }
      );
    }, 350);
    return () => window.clearTimeout(timer);
  }, [locationInput, filters, setSearchParams]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await getOpportunities({
        search: filters.search || undefined,
        type: filters.type === "ALL" ? undefined : filters.type,
        status: filters.status === "ALL" ? undefined : filters.status,
        location: filters.location || undefined,
        remote: filters.remote === "ALL" ? undefined : filters.remote,
        sort: filters.sort,
        page: filters.page,
        limit: DEFAULT_LIMIT,
      });
      setOpportunities(result.data);
      setPagination(result.pagination);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
      setError(true);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = <K extends keyof OpportunityFilterValues>(
    key: K,
    value: OpportunityFilterValues[K]
  ) => {
    if (key === "location") {
      setLocationInput(value as string);
      return;
    }
    setSearchParams(
      buildSearchParams({
        ...filters,
        [key]: value,
        page: 1,
      }),
      { replace: true }
    );
  };

  const resetFilters = () => {
    setSearchInput("");
    setLocationInput("");
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const goToPage = (page: number) => {
    setSearchParams(buildSearchParams({ ...filters, page }), { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterPanelValues: OpportunityFilterValues = {
    type: filters.type,
    status: filters.status,
    location: locationInput,
    remote: filters.remote,
    sort: filters.sort,
  };

  return (
    <AppShell
      activeNav="opportunities"
      breadcrumb="Opportunities"
      title="Opportunity Finder"
      subtitle="Discover opportunities matched with your education, skills and career goals."
    >
      <div className="space-y-5">
        <OpportunitySearch value={searchInput} onChange={setSearchInput} />

        <OpportunityCategories
          activeType={filters.type}
          onSelect={(type) => updateFilters("type", type)}
        />

        <div className="flex items-center justify-between gap-3 lg:hidden">
          <p className="text-xs text-slate-500">
            {loading ? "Loading…" : `${pagination.total} opportunities`}
          </p>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <OpportunityFilters
            filters={filterPanelValues}
            onChange={updateFilters}
            onReset={resetFilters}
            mobileOpen={mobileFiltersOpen}
            onCloseMobile={() => setMobileFiltersOpen(false)}
          />

          <section className="space-y-4">
            <div className="hidden items-center justify-between lg:flex">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-800">
                  {pagination.total}
                </span>{" "}
                opportunities found
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <label htmlFor="sort-desktop">Sort</label>
                <select
                  id="sort-desktop"
                  value={filters.sort}
                  onChange={(e) =>
                    updateFilters(
                      "sort",
                      e.target.value as OpportunitySortOption
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="DEADLINE">Deadline</option>
                  <option value="RECENT">Recently added</option>
                  <option value="TITLE">Title</option>
                </select>
              </div>
            </div>

            {loading && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <OpportunitySkeleton key={i} />
                ))}
              </div>
            )}

            {error && !loading && (
              <OpportunityErrorState onRetry={fetchData} />
            )}

            {!loading && !error && opportunities.length === 0 && (
              <OpportunityEmptyState onClearFilters={resetFilters} />
            )}

            {!loading && !error && opportunities.length > 0 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {opportunities.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      opportunity={opportunity}
                    />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={pagination.page <= 1}
                      onClick={() => goToPage(pagination.page - 1)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Previous
                    </button>
                    <span className="text-xs text-slate-500">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => goToPage(pagination.page + 1)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
