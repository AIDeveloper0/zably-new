import { redirect } from "next/navigation";
import { createServerReadOnlyClient, getSessionWithProfile } from "@/lib/supabase/auth";
import { ListingForm } from "@/components/portal/listing-form";

type ProviderListing = {
  display_name?: string | null;
  summary?: string | null;
  headline?: string | null;
  website?: string | null;
  provider_services?:
    | {
        summary?: string | null;
        service_categories?: { name?: string | null } | null;
      }[]
    | null;
};

export default async function ListingPage() {
  const { session, profile } = await getSessionWithProfile();
  if (!session) redirect("/portal/sign-in");

  const providerId = profile?.provider_id;
  const supabase = await createServerReadOnlyClient();

  let provider: ProviderListing | null = null;
  if (providerId) {
    const { data } = await supabase
      .from("providers")
      .select(
        `
          display_name,
          headline,
          summary,
          website,
          provider_services (
            summary,
            service_categories ( name )
          )
        `
      )
      .eq("id", providerId)
      .maybeSingle();
    provider = data as ProviderListing | null;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Listing
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          {provider?.display_name ?? "Your listing"}
        </h1>
        <p className="text-sm text-slate-600">
          Editing tools arrive in the next sprint. Review the information pulled from Supabase below.
        </p>
      </div>
      <ListingForm
        initialHeadline={provider?.headline}
        initialSummary={provider?.summary}
        initialWebsite={provider?.website}
      />
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Services</h2>
        <ul className="space-y-2">
          {(provider?.provider_services ?? []).map((service, idx) => (
            <li key={`${service.service_categories?.name ?? idx}`} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="font-semibold">{service.service_categories?.name ?? "Service"}</p>
              <p className="text-sm text-slate-600">{service.summary ?? "No summary."}</p>
            </li>
          ))}
          {!provider?.provider_services?.length && (
            <li className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
              No services captured yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
