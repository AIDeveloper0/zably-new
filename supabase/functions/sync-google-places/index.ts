// Scheduled Edge Function: pulls Google Places results and upserts into Supabase
// Tables touched: providers, provider_locations
// Secrets required: SUPABASE_SERVICE_ROLE_KEY, GOOGLE_MAPS_API_KEY, SUPABASE_URL (set by Supabase), optional CRON_SECRET
// Schedule example: supabase functions deploy sync-google-places --no-verify-jwt
//   then create a daily schedule hitting this function with Authorization: Bearer <CRON_SECRET>

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type PlaceSummary = {
  place_id: string;
  name: string;
  formatted_address?: string;
  types?: string[];
};

type PlaceDetail = {
  place_id: string;
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  types?: string[];
  address_components?: { long_name?: string; short_name?: string; types?: string[] }[];
};

const GOOGLE_BASE = "https://maps.googleapis.com/maps/api/place";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const googleKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
const cronSecret = Deno.env.get("CRON_SECRET");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}
if (!googleKey) {
  console.warn("[sync-google-places] GOOGLE_MAPS_API_KEY not set; function will no-op");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Adjust search terms as needed
const SEARCH_QUERIES = [
  "disability services Sydney",
  "disability services Melbourne",
  "disability services Brisbane",
  "disability services Perth",
  "disability services Adelaide",
  "disability services Hobart",
  "disability services Darwin",
  "disability services Canberra",
];

serve(async (req) => {
  if (cronSecret) {
    const authHeader = req.headers.get("authorization") ?? "";
    if (authHeader !== `Bearer ${cronSecret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  if (!googleKey) {
    return json({ imported: 0, skipped: "missing GOOGLE_MAPS_API_KEY" });
  }

  const placeIds = new Set<string>();

  for (const query of SEARCH_QUERIES) {
    const results = await fetchPlaceSummaries(query);
    results.forEach((place) => placeIds.add(place.place_id));
  }

  let imported = 0;
  for (const placeId of placeIds) {
    const detail = await fetchPlaceDetail(placeId);
    if (!detail) continue;
    const ok = await upsertProvider(detail);
    if (ok) imported += 1;
  }

  return json({ imported, unique_place_ids: placeIds.size });
});

async function fetchPlaceSummaries(query: string): Promise<PlaceSummary[]> {
  const params = new URLSearchParams({
    query,
    region: "au",
    key: googleKey!,
  });

  try {
    const res = await fetch(`${GOOGLE_BASE}/textsearch/json?${params}`);
    if (!res.ok) throw new Error(`Text search failed: ${res.status}`);
    const payload = (await res.json()) as { results?: PlaceSummary[] };
    return (payload.results ?? []).filter(
      (item): item is PlaceSummary => Boolean(item.place_id && item.name)
    );
  } catch (error) {
    console.warn("[sync-google-places] text search error", error);
    return [];
  }
}

async function fetchPlaceDetail(placeId: string): Promise<PlaceDetail | null> {
  const params = new URLSearchParams({
    place_id: placeId,
    key: googleKey!,
    fields:
      "place_id,name,formatted_address,formatted_phone_number,international_phone_number,website,address_components,types",
  });

  try {
    const res = await fetch(`${GOOGLE_BASE}/details/json?${params}`);
    if (!res.ok) throw new Error(`Details failed: ${res.status}`);
    const payload = (await res.json()) as { result?: PlaceDetail };
    if (!payload.result?.name || !payload.result.place_id) return null;
    return payload.result;
  } catch (error) {
    console.warn("[sync-google-places] detail error", error);
    return null;
  }
}

async function upsertProvider(place: PlaceDetail): Promise<boolean> {
  const slug = `google-${place.place_id}`;
  const phone =
    place.formatted_phone_number ?? place.international_phone_number ?? null;
  const parsed = parseAddressComponents(place.address_components) ??
    parseFormattedAddress(place.formatted_address);

  const { data: provider, error: providerError } = await supabase
    .from("providers")
    .upsert(
      {
        slug,
        display_name: place.name,
        headline: place.formatted_address,
        summary: place.formatted_address,
        website: place.website,
        public_phone: phone,
        status: "published",
        is_active: true,
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();

  if (providerError || !provider?.id) {
    console.warn("[sync-google-places] provider upsert failed", providerError);
    return false;
  }

  const location = {
    provider_id: provider.id,
    location_label: parsed?.suburb ? `${parsed.suburb} location` : "Primary location",
    address_line1: place.formatted_address,
    suburb: parsed?.suburb,
    state: parsed?.state,
    postcode: parsed?.postcode,
    country: parsed?.country ?? "Australia",
    is_primary: true,
  };

  const { error: locationError } = await supabase
    .from("provider_locations")
    .upsert(location, { onConflict: "provider_id" });

  if (locationError) {
    console.warn("[sync-google-places] location upsert failed", locationError);
    return false;
  }

  return true;
}

function parseAddressComponents(
  components?: { long_name?: string; short_name?: string; types?: string[] }[]
): { state?: string; suburb?: string; postcode?: string; country?: string } | undefined {
  if (!components?.length) return undefined;
  const get = (type: string) => components.find((c) => c.types?.includes(type));
  return {
    state: get("administrative_area_level_1")?.short_name,
    suburb: get("locality")?.short_name ?? get("sublocality_level_1")?.short_name,
    postcode: get("postal_code")?.short_name,
    country: get("country")?.short_name,
  };
}

function parseFormattedAddress(
  address?: string | null
): { state?: string; suburb?: string; postcode?: string; country?: string } | undefined {
  if (!address) return undefined;
  const stateMatch = address.match(/\b(ACT|NSW|NT|QLD|SA|TAS|VIC|WA)\b/i);
  const postcodeMatch = address.match(/\b(\d{4})\b/);
  const parts = address.split(",");
  const suburbWithState = parts.length > 1 ? parts[parts.length - 2].trim() : parts[0].trim();
  const suburb = suburbWithState
    .replace(/\b(ACT|NSW|NT|QLD|SA|TAS|VIC|WA)\b/i, "")
    .replace(/\d{4}/g, "")
    .trim();

  return {
    state: stateMatch?.[1]?.toUpperCase(),
    suburb: suburb || parts[0]?.trim(),
    postcode: postcodeMatch?.[1],
    country: "Australia",
  };
}

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
}
