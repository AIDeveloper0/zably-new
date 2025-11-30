import { redirect } from "next/navigation";
import { createServerReadOnlyClient, getSessionWithProfile } from "@/lib/supabase/auth";

type AuditEntry = {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  actor?: { providers?: { display_name?: string | null } | null } | null;
};

export default async function AuditPage() {
  const { session, profile } = await getSessionWithProfile();
  if (!session) redirect("/portal/sign-in");
  if (!profile || !["admin", "moderator"].includes(profile.role ?? "")) {
    redirect("/dashboard");
  }

  const supabase = await createServerReadOnlyClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("id, action, entity_type, entity_id, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const entries: AuditEntry[] = data ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Admin</p>
        <h1 className="text-2xl font-semibold text-slate-900">Audit log</h1>
        <p className="text-sm text-slate-600">Recent moderation and listing changes.</p>
      </header>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-5 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Time</span>
          <span>Action</span>
          <span>Entity</span>
          <span>Entity ID</span>
          <span>Metadata</span>
        </div>
        <div className="divide-y divide-slate-200">
          {entries.map((entry) => (
            <div key={entry.id} className="grid grid-cols-5 items-center px-4 py-3 text-sm text-slate-700">
              <span>{new Date(entry.created_at).toLocaleString()}</span>
              <span className="font-semibold text-slate-900">{entry.action}</span>
              <span>{entry.entity_type}</span>
              <span className="break-all text-xs text-slate-500">{entry.entity_id}</span>
              <span className="text-xs text-slate-500">
                {Object.keys(entry.metadata || {}).length ? JSON.stringify(entry.metadata) : "—"}
              </span>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="px-4 py-6 text-sm text-slate-500">No audit events yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
