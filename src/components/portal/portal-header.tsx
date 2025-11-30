import { signOut } from "@/app/portal/sign-in/actions";
import type { ProfileWithProvider } from "@/lib/supabase/auth";

export function PortalHeader({ profile }: { profile: ProfileWithProvider | null }) {
  const provider = profile?.providers?.[0];
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Provider portal
        </p>
        <p className="text-lg font-semibold text-slate-900">
          {provider?.display_name ?? "Provider"}
        </p>
        <p className="text-sm text-slate-500">
          Role: {profile?.role ?? "provider"}
        </p>
      </div>
      <form action={signOut} className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
