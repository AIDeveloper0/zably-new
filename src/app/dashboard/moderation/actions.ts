"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerAuthClient, getSessionWithProfile } from "@/lib/supabase/auth";

async function ensureAdmin() {
  const { session, profile } = await getSessionWithProfile();
  if (!session) redirect("/portal/sign-in");
  if (!profile || !["admin", "moderator"].includes(profile.role ?? "")) {
    throw new Error("Not authorized");
  }
  return { supabase: await createServerAuthClient() };
}

export async function approveReview(reviewId: string) {
  const { supabase } = await ensureAdmin();
  await supabase.from("reviews").update({ status: "approved" }).eq("id", reviewId);
  revalidatePath("/dashboard/moderation");
}

export async function rejectReview(reviewId: string) {
  const { supabase } = await ensureAdmin();
  await supabase.from("reviews").update({ status: "rejected" }).eq("id", reviewId);
  revalidatePath("/dashboard/moderation");
}
