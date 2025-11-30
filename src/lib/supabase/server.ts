import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const getSupabaseServerClient = cache(() =>
  createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
);
