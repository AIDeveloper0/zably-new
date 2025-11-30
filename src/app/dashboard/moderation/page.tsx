import { redirect } from "next/navigation";
import { approveReview, rejectReview } from "@/app/dashboard/moderation/actions";
import { getSessionWithProfile, createServerReadOnlyClient } from "@/lib/supabase/auth";

type ModerationReview = {
  id: string;
  rating: number;
  body?: string | null;
  status: string;
  submitted_at?: string | null;
  display_name?: string | null;
  provider_id?: string | null;
  providers?: { display_name?: string | null }[] | null;
};

export default async function ModerationPage() {
  const { session, profile } = await getSessionWithProfile();
  if (!session) redirect("/portal/sign-in");
  if (!profile || !["admin", "moderator"].includes(profile.role ?? "")) {
    redirect("/dashboard");
  }

  const supabase = await createServerReadOnlyClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, body, status, submitted_at, display_name, provider_id, providers(display_name)")
    .order("submitted_at", { ascending: false })
    .limit(20);

  const pending = ((reviews ?? []) as ModerationReview[]).filter((r) => r.status === "pending");

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Admin</p>
        <h1 className="text-2xl font-semibold text-slate-900">Moderation queue</h1>
        <p className="text-sm text-slate-600">Approve or reject reviews before they appear publicly.</p>
      </header>

      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {pending.length === 0 && (
          <p className="text-sm text-slate-500">No pending reviews.</p>
        )}
        {pending.map((review) => (
          <form
            key={review.id}
            action={async () => {}}
            className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold text-slate-900">
                {review.display_name ?? "Anonymous"} · {review.rating}★
              </p>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Pending
              </span>
            </div>
            <p className="text-sm text-slate-700">{review.body ?? "No comment"}</p>
            <p className="text-xs text-slate-500">
              Provider:{" "}
              {Array.isArray(review.providers)
                ? review.providers[0]?.display_name ?? review.provider_id
                : review.provider_id}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                formAction={async () => {
                  "use server";
                  await approveReview(review.id);
                }}
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Approve
              </button>
              <button
                formAction={async () => {
                  "use server";
                  await rejectReview(review.id);
                }}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
              >
                Reject
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
