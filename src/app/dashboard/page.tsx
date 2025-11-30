import { redirect } from "next/navigation";
import { createServerReadOnlyClient, getSessionWithProfile } from "@/lib/supabase/auth";
import { PortalStatCard } from "@/components/portal/stat-card";

type ProviderSummary = {
  id: string;
  display_name: string | null;
  status: string | null;
  headline: string | null;
  provider_locations?: { id: string }[] | null;
  provider_services?: { service_categories?: { name?: string | null } | null }[] | null;
};

export default async function DashboardPage() {
  const { session, profile } = await getSessionWithProfile();
  if (!session) redirect("/portal/sign-in");

  const supabase = await createServerReadOnlyClient();
  const providerId = profile?.provider_id;

  let provider: ProviderSummary | null = null;
  let reviewCount = 0;

  if (providerId) {
    const [providerRes, reviewRes] = await Promise.all([
      supabase
        .from("providers")
        .select(
          `
          id,
          display_name,
          status,
          headline,
          provider_locations ( id ),
          provider_services ( service_categories ( name ) )
        `
        )
        .eq("id", providerId)
        .maybeSingle(),
      supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("provider_id", providerId),
    ]);

    if (providerRes.data) provider = providerRes.data as ProviderSummary;
    reviewCount = reviewRes.count ?? 0;
  }

  const serviceCount = provider?.provider_services?.length ?? 0;
  const locationCount = provider?.provider_locations?.length ?? 0;

  const actions = [
    {
      title: provider?.status === "published" ? "Keep listing fresh" : "Finish listing",
      description:
        provider?.status === "published"
          ? "Review your summary and services every 30 days to stay higher in search."
          : "Complete your profile details and submit for moderation.",
      cta: "Go to listing",
      href: "/dashboard/listing",
    },
    {
      title: "Respond to reviews",
      description: "A thoughtful response increases trust and unlocks the right-of-reply timestamp.",
      cta: "Open reviews",
      href: "/dashboard/reviews",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <PortalStatCard
          label="Listing status"
          value={provider?.status ?? "draft"}
          description={provider?.headline ?? "Complete your profile to publish."}
        />
        <PortalStatCard
          label="Service areas"
          value={`${serviceCount} services`}
          description="Add niche tags to improve discoverability."
        />
        <PortalStatCard
          label="Reviews"
          value={reviewCount}
          description="New reviews appear here after moderation."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Listing health</h2>
          <p className="text-sm text-slate-600">
            Services: {serviceCount} · Locations: {locationCount} · Status: {provider?.status ?? "draft"}
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {(provider?.provider_services ?? []).map((service, idx) => (
              <li key={`${service.service_categories?.name ?? idx}`} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {service.service_categories?.name ?? "Service"}
              </li>
            ))}
            {serviceCount === 0 && (
              <li className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
                No services added yet. Update your listing to appear in search filters.
              </li>
            )}
          </ul>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Next actions</h2>
          <ul className="mt-4 space-y-4">
            {actions.map((action) => (
              <li key={action.title} className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-base font-semibold text-slate-900">{action.title}</p>
                <p className="text-sm text-slate-600">{action.description}</p>
                <a href={action.href} className="text-sm font-semibold text-indigo-600">
                  {action.cta}
                </a>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Inbox snapshot</h2>
        <p className="text-sm text-slate-600">
          Leads, review alerts, and audit events appear here. Integrations (email + Slack) arrive in Week 3.
        </p>
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
          No notifications yet. Once your listing is published and reviews start rolling in, you’ll see moderation alerts here.
        </div>
      </section>
    </div>
  );
}
