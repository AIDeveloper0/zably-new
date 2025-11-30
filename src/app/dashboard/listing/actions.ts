"use server";

import { redirect } from "next/navigation";
import { createServerAuthClient, getSessionWithProfile } from "@/lib/supabase/auth";

type ListingState = {
  success?: string;
  error?: string;
};

export async function updateListing(prevState: ListingState, formData: FormData): Promise<ListingState> {
  const { session, profile } = await getSessionWithProfile();
  if (!session) {
    redirect("/portal/sign-in");
  }

  const providerId = profile?.provider_id;
  if (!providerId) {
    return { error: "No provider linked to this account." };
  }

  const headline = String(formData.get("headline") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (!headline || !summary) {
    return { error: "Headline and summary are required." };
  }

  const supabase = await createServerAuthClient();
  const { error } = await supabase
    .from("providers")
    .update({
      headline,
      summary,
      website: website || null,
    })
    .eq("id", providerId);

  if (error) {
    return { error: error.message };
  }

  return { success: "Listing updated. Changes will reflect on the public site after moderation (if required)." };
}
