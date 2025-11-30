import { redirect } from "next/navigation";
import { createServerReadOnlyClient, getSessionWithProfile } from "@/lib/supabase/auth";

export default async function ReviewsPage() {
  const { session, profile } = await getSessionWithProfile();
  if (!session) redirect("/portal/sign-in");

  const supabase = await createServerReadOnlyClient();
  const providerId = profile?.provider_id;
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, body, status, submitted_at, display_name")
    .eq("provider_id", providerId)
    .order("submitted_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Reviews
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">Moderation queue</h1>
        <p className="text-sm text-slate-600">
          Approve, reject, or reply to reviews. Workflow automation (spam checks, right-of-reply notifications) lands in Week 3.
        </p>
      </div>
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {(reviews ?? []).length === 0 && (
          <p className="text-sm text-slate-500">
            No reviews yet. Share your public profile to start collecting feedback.
          </p>
        )}
        {(reviews ?? []).map((review) => (
          <article key={review.id} className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold text-slate-900">{review.display_name ?? "Anonymous"}</p>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                {review.status}
              </span>
            </div>
            <p className="text-sm text-slate-600">{review.body ?? "No comment provided."}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
