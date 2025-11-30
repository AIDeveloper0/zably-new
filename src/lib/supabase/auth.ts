import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Session } from "@supabase/supabase-js";
import { env } from "@/lib/env";

async function buildCookieClient(readOnly: boolean) {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Parameters<typeof cookieStore.set>[2]) {
        if (readOnly) return;
        cookieStore.set(name, value, options);
      },
      remove(name: string, options: Parameters<typeof cookieStore.set>[2]) {
        if (readOnly) return;
        cookieStore.set(name, "", { ...options, maxAge: 0 });
      },
    },
  });
}

export async function createServerAuthClient() {
  return buildCookieClient(false);
}

export async function createServerReadOnlyClient() {
  return buildCookieClient(true);
}

export type ProfileWithProvider = {
  id: string;
  role?: string | null;
  provider_id?: string | null;
  providers?: {
    id?: string | null;
    display_name?: string | null;
    status?: string | null;
    headline?: string | null;
  }[] | null;
};

export async function getSessionWithProfile(): Promise<{
  session: Session | null;
  profile: ProfileWithProvider | null;
}> {
  const supabase = await createServerReadOnlyClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { session: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select(
      `
      id,
      role,
      provider_id,
      providers:provider_id (
        id,
        display_name,
        status,
        headline
      )
    `
    )
    .eq("id", session.user.id)
    .maybeSingle();

  return { session, profile: profile as ProfileWithProvider | null };
}
