type PortalStatCardProps = {
  label: string;
  value: string | number;
  description?: string;
  tone?: "default" | "warning" | "success";
};

export function PortalStatCard({
  label,
  value,
  description,
  tone = "default",
}: PortalStatCardProps) {
  const toneClass =
    tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-slate-200 bg-white text-slate-900";

  return (
    <div className={`rounded-2xl border ${toneClass} p-5 shadow-sm`}>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {description && (
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      )}
    </div>
  );
}
