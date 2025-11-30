import { redirect } from "next/navigation";
import { getSessionWithProfile } from "@/lib/supabase/auth";

export default async function LeadsPage() {
  const { session } = await getSessionWithProfile();
  if (!session) redirect("/portal/sign-in");

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Leads</h1>
      <p className="text-sm text-slate-600">
        Lead capture and paid-routing will be available after Stripe/PayID integration (Week 4).
        For now, this section will display enquiries submitted via the public directory.
      </p>
      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
        No leads yet. Once the paid lead feature is enabled, you’ll see them here with audit trails.
      </div>
    </div>
  );
}
