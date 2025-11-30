"use client";

import { useActionState } from "react";
import { requestMagicLink } from "@/app/portal/sign-in/actions";

const initialState = { success: "", error: "" };

export function PortalSignInForm() {
  const [state, formAction] = useActionState(requestMagicLink, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="space-y-2 text-sm font-medium text-slate-700">
        Work email
        <input
          type="email"
          name="email"
          required
          placeholder="you@provider.com.au"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 hover:bg-slate-800"
      >
        Send magic link
      </button>
      {state?.error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.success}
        </p>
      )}
    </form>
  );
}
