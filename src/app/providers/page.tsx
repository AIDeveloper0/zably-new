import { ProvidersFilterPanel } from "@/components/search/filter-panel";
import { ProviderCard } from "@/components/providers/provider-card";
import {
  fetchDirectoryFilters,
  fetchProviders,
} from "@/lib/supabase/queries";
import { toArray } from "@/lib/utils";

type ProvidersPageProps = {
  searchParams?: Promise<{
    q?: string;
    page?: string;
    state?: string | string[];
    category?: string | string[];
    funding?: string | string[];
  }>;
};

export default async function ProvidersPage({ searchParams }: ProvidersPageProps) {
  const params = (await searchParams) ?? {};

  const q = params.q ?? "";
  const page = Math.max(1, Number(params.page ?? 1));
  const states = toArray(params.state).map((state) =>
    state.toUpperCase()
  );
  const categories = toArray(params.category);
  const funding = toArray(params.funding);

  const [{ providers, total, limit }, filters] = await Promise.all([
    fetchProviders({
      query: q,
      page,
      states,
      categories,
      funding,
    }),
    fetchDirectoryFilters(),
  ]);

  const pageCount = Math.ceil(total / limit || 1);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Public directory
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Browse disability providers across Australia
        </h1>
        <p className="text-base text-slate-600">
          Filter by state, funding stream, or service category. Provider portal
          logins stay separate so personal information never appears here.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <ProvidersFilterPanel
          filters={filters}
          selected={{ query: q, states, categories, funding }}
          className="lg:sticky lg:top-24"
        />

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
            <p>
              Showing <strong>{providers.length}</strong> of {total} providers
            </p>
            <p>
              Page {page} of {pageCount || 1}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
          {providers.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-slate-500">
              No providers match those filters yet. Try removing a filter or check
              back after seeding the database.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
