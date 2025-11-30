import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatLocation } from "@/lib/utils";
import { env } from "@/lib/env";
import {
  filterMockProviderSummaries,
  getMockProvider,
  mockDirectoryFilters,
  type MockProvider,
} from "@/lib/supabase/mock-data";

export type ProviderSummary = {
  id: string;
  slug: string;
  name: string;
  headline?: string | null;
  summary?: string | null;
  tags: string[];
  services: string[];
  state?: string | null;
  suburb?: string | null;
};

export type ProviderDetail = ProviderSummary & {
  website?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  funding: string[];
  locations: { suburb?: string | null; state?: string | null; label?: string | null }[];
  servicesDetail: { name: string; summary?: string | null }[];
};

export type DirectoryFilters = {
  categories: { slug: string; name: string }[];
  funding: { slug: string; label: string }[];
  states: string[];
};

export type ProviderSearchInput = {
  query?: string;
  categories?: string[];
  states?: string[];
  funding?: string[];
  page?: number;
  limit?: number;
};

type ProviderRecord = {
  id: string;
  slug: string;
  display_name: string;
  headline?: string | null;
  summary?: string | null;
  website?: string | null;
  public_email?: string | null;
  public_phone?: string | null;
  provider_locations?:
    | { state?: string | null; suburb?: string | null; location_label?: string | null }[]
    | null;
  provider_services?:
    | {
        summary?: string | null;
        is_featured?: boolean | null;
        service_categories?: { name?: string | null; slug?: string | null } | null;
      }[]
    | null;
  provider_tag_map?:
    | { provider_tags?: { label?: string | null } | null }[]
    | null;
  provider_funding_options?:
    | { funding_types?: { label?: string | null; slug?: string | null } | null }[]
    | null;
};

const PROVIDER_FIELDS = `
  id,
  slug,
  display_name,
  headline,
  summary,
  website,
  public_email,
  public_phone,
  provider_locations (state, suburb, location_label),
  provider_services (
    summary,
    is_featured,
    service_categories (name, slug)
  ),
  provider_tag_map (
    provider_tags (label)
  ),
  provider_funding_options (
    funding_types (label, slug)
  )
`;

const DEFAULT_PAGE_SIZE = 20;
const isMockSupabase =
  env.supabaseUrl.includes("example.supabase.co") ||
  env.supabaseAnonKey === "public-anon-key";

export async function fetchProviders(
  input: ProviderSearchInput = {}
): Promise<{
  providers: ProviderSummary[];
  total: number;
  page: number;
  limit: number;
}> {
  const page = Math.max(1, input.page ?? 1);
  const limit = Math.min(50, input.limit ?? DEFAULT_PAGE_SIZE);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  if (isMockSupabase) {
    const filtered = filterMockProviderSummaries({
      query: input.query,
      states: input.states,
      categories: input.categories,
      funding: input.funding,
    }).map(mapMockProviderSummary);

    const paginated = filtered.slice(from, to + 1);

    return {
      providers: paginated,
      total: filtered.length,
      page,
      limit,
    };
  }

  const supabase = getSupabaseServerClient();

  let query = supabase
    .from("providers")
    .select(PROVIDER_FIELDS, { count: "exact" })
    .eq("status", "published")
    .eq("is_active", true);

  if (input.query) {
    const search = input.query.trim();
    if (search.length) {
      query = query.or(
        `display_name.ilike.%${search}%,summary.ilike.%${search}%`
      );
    }
  }

  const providerIds = await collectProviderIds({
    categories: input.categories,
    states: input.states,
    funding: input.funding,
  });

  if (providerIds?.length) {
    query = query.in("id", providerIds);
  } else if (
    (input.categories?.length ||
      input.states?.length ||
      input.funding?.length) &&
    providerIds?.length === 0
  ) {
    return { providers: [], total: 0, page, limit };
  }

  try {
    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      providers: (data ?? []).map((item) =>
        mapProviderSummary(item as ProviderRecord)
      ),
      total: count ?? 0,
      page,
      limit,
    };
  } catch (err) {
    const fallback = filterMockProviderSummaries({
      query: input.query,
      states: input.states,
      categories: input.categories,
      funding: input.funding,
    }).map(mapMockProviderSummary);
    console.warn("[Supabase] fetchProviders failed, using mock data", err);
    return { providers: fallback.slice(from, to + 1), total: fallback.length, page, limit };
  }
}

export async function fetchProviderDetail(
  slug: string
): Promise<ProviderDetail | null> {
  if (isMockSupabase) {
    const provider = getMockProvider(slug);
    return provider
      ? { ...mapMockProviderSummary(provider), ...provider }
      : null;
  }

  const supabase = getSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("providers")
      .select(PROVIDER_FIELDS)
      .eq("status", "published")
      .eq("is_active", true)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) return null;

    const record = data as ProviderRecord;

    return {
      ...mapProviderSummary(record),
      website: record.website,
      contactEmail: record.public_email,
      contactPhone: record.public_phone,
      funding: uniqueStrings(
        record.provider_funding_options?.map(
          (option) => option.funding_types?.label ?? ""
        ) ?? []
      ),
      locations:
        record.provider_locations?.map((location) => ({
          suburb: location.suburb,
          state: location.state,
          label: location.location_label,
        })) ?? [],
      servicesDetail:
        record.provider_services?.map((service) => ({
          name: service.service_categories?.name ?? "Service",
          summary: service.summary,
        })) ?? [],
    };
  } catch (err) {
    const provider = getMockProvider(slug);
    console.warn("[Supabase] fetchProviderDetail failed, using mock data", err);
    return provider ? { ...mapMockProviderSummary(provider), ...provider } : null;
  }

}

export async function fetchDirectoryFilters(): Promise<DirectoryFilters> {
  if (isMockSupabase) {
    return mockDirectoryFilters;
  }

  const supabase = getSupabaseServerClient();

  try {
    const [categoriesRes, fundingRes, statesRes] = await Promise.all([
      supabase
        .from("service_categories")
        .select("name, slug")
        .order("sort_order", { ascending: true }),
      supabase
        .from("funding_types")
        .select("label, slug")
        .order("sort_order", { ascending: true }),
      supabase.from("provider_locations").select("state"),
    ]);

    if (categoriesRes.error) {
      throw categoriesRes.error;
    }
    if (fundingRes.error) {
      throw fundingRes.error;
    }
    if (statesRes.error) {
      throw statesRes.error;
    }

    const states = uniqueStrings(
      (statesRes.data ?? [])
        .map((row) => row.state?.toUpperCase() ?? "")
        .filter(Boolean)
    ).sort();

    return {
      categories:
        categoriesRes.data?.map((item) => ({
          slug: item.slug,
          name: item.name,
        })) ?? [],
      funding:
        fundingRes.data?.map((item) => ({
          slug: item.slug,
          label: item.label,
        })) ?? [],
      states,
    };
  } catch (err) {
    console.warn("[Supabase] fetchDirectoryFilters failed, using mock data", err);
    return mockDirectoryFilters;
  }
}

async function collectProviderIds(filters: {
  categories?: string[];
  states?: string[];
  funding?: string[];
}): Promise<string[] | undefined> {
  if (isMockSupabase) return undefined;

  const supabase = getSupabaseServerClient();
  let ids: string[] | undefined;

  try {
    if (filters.states?.length) {
      const { data, error } = await supabase
        .from("provider_locations")
        .select("provider_id, state")
        .in(
          "state",
          filters.states.map((state) => state.toUpperCase())
        );

      if (error) throw error;
      const providerIds = uniqueStrings(
        ((data ?? []) as { provider_id: string }[]).map(
          (row) => row.provider_id
        )
      );
      ids = intersect(ids, providerIds);
    }

    if (filters.categories?.length) {
      const { data, error } = await supabase
        .from("provider_services")
        .select("provider_id, service_categories!inner(slug)")
        .in("service_categories.slug", filters.categories);

      if (error) throw error;
      const providerIds = uniqueStrings(
        ((data ?? []) as { provider_id: string }[]).map(
          (row) => row.provider_id
        )
      );
      ids = intersect(ids, providerIds);
    }

    if (filters.funding?.length) {
      const { data, error } = await supabase
        .from("provider_funding_options")
        .select("provider_id, funding_types!inner(slug)")
        .in("funding_types.slug", filters.funding);

      if (error) throw error;
      const providerIds = uniqueStrings(
        ((data ?? []) as { provider_id: string }[]).map(
          (row) => row.provider_id
        )
      );
      ids = intersect(ids, providerIds);
    }
  } catch (err) {
    console.warn("[Supabase] collectProviderIds failed", err);
    return undefined;
  }

  return ids;
}

function mapProviderSummary(record: ProviderRecord): ProviderSummary {
  const location = record.provider_locations?.[0];
  return {
    id: record.id,
    slug: record.slug,
    name: record.display_name,
    headline: record.headline,
    summary: record.summary,
    tags: uniqueStrings(
      (record.provider_tag_map ?? []).map(
        (tag) => tag.provider_tags?.label ?? ""
      )
    ),
    services: uniqueStrings(
      (record.provider_services ?? []).map(
        (service) => service?.service_categories?.name ?? ""
      )
    ),
    state: location?.state,
    suburb: location?.suburb,
  };
}

function uniqueStrings(values: (string | null | undefined)[] = []) {
  return Array.from(
    new Set(
      values
        .filter((value): value is string => Boolean(value && value.trim()))
        .map((value) => value.trim())
    )
  );
}

function intersect(current: string[] | undefined, next: string[]): string[] {
  if (!next.length) return [];
  if (!current) return next;
  const nextSet = new Set(next);
  return current.filter((id) => nextSet.has(id));
}

type LocationLike = {
  suburb?: string | null;
  state?: string | null;
};

export function formatProviderLocation(provider: LocationLike) {
  return formatLocation(provider.suburb, provider.state);
}

function mapMockProviderSummary(provider: MockProvider): ProviderSummary {
  return {
    id: provider.id,
    slug: provider.slug,
    name: provider.name,
    headline: provider.headline,
    summary: provider.summary,
    tags: provider.tags,
    services: provider.services,
    state: provider.state,
    suburb: provider.suburb,
  };
}
