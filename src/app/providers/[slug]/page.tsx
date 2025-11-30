import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin, Phone, Mail } from "lucide-react";
import { notFound } from "next/navigation";
import {
  fetchProviderDetail,
  formatProviderLocation,
} from "@/lib/supabase/queries";

type ProviderDetailPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: ProviderDetailPageProps) {
  const provider = await fetchProviderDetail(params.slug);
  if (!provider) return {};
  return {
    title: `${provider.name} · Zably`,
    description: provider.summary ?? provider.headline ?? undefined,
  };
}

export default async function ProviderDetailPage({
  params,
}: ProviderDetailPageProps) {
  const provider = await fetchProviderDetail(params.slug);
  if (!provider) notFound();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12">
      <Link
        href="/providers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to search
      </Link>

      <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
              Verified listing
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">
              {provider.name}
            </h1>
            {provider.headline && (
              <p className="text-lg text-slate-600">{provider.headline}</p>
            )}
          </div>
          {provider.website && (
            <a
              href={provider.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300"
            >
              Visit Website <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {provider.summary && (
          <p className="text-base leading-relaxed text-slate-600">
            {provider.summary}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Contact
            </h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-500" aria-hidden />
                {formatProviderLocation(provider)}
              </li>
              {provider.contactEmail && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-500" aria-hidden />
                  <a
                    href={`mailto:${provider.contactEmail}`}
                    className="font-semibold text-slate-900"
                  >
                    {provider.contactEmail}
                  </a>
                </li>
              )}
              {provider.contactPhone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-500" aria-hidden />
                  <a
                    href={`tel:${provider.contactPhone}`}
                    className="font-semibold text-slate-900"
                  >
                    {provider.contactPhone}
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Funding &amp; services
            </h2>
            <div className="flex flex-wrap gap-2">
              {provider.funding.map((item) => (
                <span
                  key={item}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {provider.servicesDetail.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Service snapshots
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {provider.servicesDetail.map((service) => (
                <div
                  key={service.name}
                  className="rounded-2xl border border-slate-100 p-5"
                >
                  <p className="text-base font-semibold text-slate-900">
                    {service.name}
                  </p>
                  {service.summary && (
                    <p className="text-sm text-slate-600">{service.summary}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {provider.locations.length > 1 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Locations
            </h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {provider.locations.map((location, index) => (
                <li
                  key={`${location.label}-${index}`}
                  className="rounded-2xl border border-slate-100 p-4 text-sm text-slate-600"
                >
                  <p className="font-semibold text-slate-900">
                    {location.label ?? "Location"}
                  </p>
                  <p>{formatProviderLocation(location)}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
