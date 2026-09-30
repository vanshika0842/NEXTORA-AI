import { AlertTriangle, RefreshCw, SearchX } from "lucide-react";

export function OpportunitySkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 h-5 w-20 rounded-full bg-slate-100" />
      <div className="mb-2 h-5 w-3/4 rounded bg-slate-100" />
      <div className="mb-4 h-4 w-1/2 rounded bg-slate-100" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
      </div>
      <div className="mt-5 flex justify-between">
        <div className="h-5 w-16 rounded-full bg-slate-100" />
        <div className="h-8 w-24 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

export function OpportunityEmptyState({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
      <SearchX className="mx-auto h-10 w-10 text-slate-300" />
      <h3 className="mt-4 text-base font-semibold text-slate-900">
        No opportunities found
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Try changing your filters or search terms.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        Clear filters
      </button>
    </div>
  );
}

export function OpportunityErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-16 text-center">
      <AlertTriangle className="mx-auto h-10 w-10 text-red-400" />
      <h3 className="mt-4 text-base font-semibold text-slate-900">
        Couldn&apos;t load opportunities
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Something went wrong while loading opportunities. Please try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  );
}
