"use server";

import { redirect } from "next/navigation";
import { createServerAuthClient } from "@/lib/supabase/auth";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type ActionState = {
  success?: string;
  error?: string;
};

export async function requestMagicLink(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createServerAuthClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${SITE_URL}/dashboard`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "Check your inbox for a secure magic link. The login window is valid for 5 minutes.",
  };
}

export async function signOut() {
  const supabase = await createServerAuthClient();
  await supabase.auth.signOut();
  redirect("/portal/sign-in");
}
