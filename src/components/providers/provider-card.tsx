import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import {
  type ProviderSummary,
  formatProviderLocation,
} from "@/lib/supabase/queries";

export function ProviderCard({ provider }: { provider: ProviderSummary }) {
  return (
    <article className="group flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 transition hover:-translate-y-1 hover:border-indigo-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
            Verified provider
          </p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-900">
            <Link href={`/providers/${provider.slug}`}>{provider.name}</Link>
          </h3>
        </div>
        <Link
          href={`/providers/${provider.slug}`}
          className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-indigo-500 group-hover:text-indigo-600"
          aria-label={`Open ${provider.name}`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      {provider.headline && (
        <p className="text-base text-slate-600">{provider.headline}</p>
      )}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <MapPin className="h-4 w-4" aria-hidden />
        {formatProviderLocation(provider)}
      </div>
      {provider.services.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {provider.services.slice(0, 3).map((service) => (
            <span
              key={service}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {service}
            </span>
          ))}
        </div>
      )}
      {provider.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-dashed border-slate-200 pt-4">
          {provider.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
