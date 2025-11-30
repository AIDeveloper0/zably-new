"use client";

import { useActionState } from "react";
import { updateListing } from "@/app/dashboard/listing/actions";

type ListingFormProps = {
  initialHeadline?: string | null;
  initialSummary?: string | null;
  initialWebsite?: string | null;
};

const initialState = { success: "", error: "" };

export function ListingForm({ initialHeadline, initialSummary, initialWebsite }: ListingFormProps) {
  const [state, formAction] = useActionState(updateListing, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-3">
        <label className="space-y-1 text-sm font-semibold text-slate-800">
          Headline
          <input
            name="headline"
            defaultValue={initialHeadline ?? ""}
            required
            className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
            placeholder="What you do and where"
          />
        </label>
        <label className="space-y-1 text-sm font-semibold text-slate-800">
          Summary
          <textarea
            name="summary"
            defaultValue={initialSummary ?? ""}
            required
            rows={4}
            className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
            placeholder="Public-safe description for the directory."
          />
        </label>
        <label className="space-y-1 text-sm font-semibold text-slate-800">
          Website
          <input
            name="website"
            type="url"
            defaultValue={initialWebsite ?? ""}
            className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
            placeholder="https://example.com.au"
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Save changes
        </button>
        {state.error && (
          <p className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</p>
        )}
        {state.success && (
          <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{state.success}</p>
        )}
      </div>
    </form>
  );
}
