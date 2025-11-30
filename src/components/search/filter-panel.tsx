 "use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DirectoryFilters } from "@/lib/supabase/queries";

type ProvidersFilterPanelProps = {
  filters: DirectoryFilters;
  selected: {
    query?: string;
    states?: string[];
    categories?: string[];
    funding?: string[];
  };
  className?: string;
};

export function ProvidersFilterPanel({
  filters,
  selected,
  className,
}: ProvidersFilterPanelProps) {
  const states = selected.states ?? [];
  const categories = selected.categories ?? [];
  const funding = selected.funding ?? [];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const toggleLabel = mobileOpen ? "Hide" : "Show";

  const handleToggleFilters = () => {
    if (!desktopOpen) {
      setDesktopOpen(true);
      return;
    }
    setMobileOpen((prev) => !prev);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm",
          desktopOpen ? "md:hidden" : "md:flex"
        )}
      >
        <div>
          <p className="text-sm font-semibold text-slate-900">Filters</p>
          <p className="text-xs text-slate-500">Tap to refine your results</p>
        </div>
        <button
          type="button"
          aria-expanded={mobileOpen}
          onClick={handleToggleFilters}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700"
        >
          <Filter className="h-4 w-4" />
          {toggleLabel}
        </button>
      </div>
      <form
        action="/providers"
        method="get"
        className={cn(
          "mt-4 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 md:mt-0",
          mobileOpen ? "block" : "hidden",
          desktopOpen ? "md:block" : "md:hidden"
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="q">
            Search providers
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={selected.query ?? ""}
            placeholder="Search providers"
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-base"
          />
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
            onClick={() => setMobileOpen(false)}
          >
            Apply
          </button>
          <button
            type="button"
            className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 md:inline-flex"
            onClick={() => {
              setDesktopOpen(false);
              setMobileOpen(false);
            }}
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
            Close
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <FilterGroup title="State or territory">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filters.states.map((state) => (
              <label key={state} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="state"
                  value={state}
                  defaultChecked={states.includes(state)}
                  className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                {state}
              </label>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Service categories">
          <div className="grid gap-3 sm:grid-cols-2">
            {filters.categories.map((category) => (
              <label key={category.slug} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="category"
                  value={category.slug}
                  defaultChecked={categories.includes(category.slug)}
                  className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                {category.name}
              </label>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Funding types">
          <div className="flex flex-wrap gap-3">
            {filters.funding.map((item) => (
              <label key={item.slug} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="funding"
                  value={item.slug}
                  defaultChecked={funding.includes(item.slug)}
                  className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                {item.label}
              </label>
            ))}
          </div>
        </FilterGroup>
        <Link
          href="/providers"
          className="inline-flex text-sm font-semibold text-indigo-600 underline-offset-4 hover:underline"
        >
          Reset filters
        </Link>
      </form>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
