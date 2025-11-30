import Link from "next/link";
import {
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  Workflow,
  MapPinned,
  BookOpenCheck,
  Coins,
  GlobeLock,
  Star,
} from "lucide-react";
import { DirectorySearchForm } from "@/components/search/directory-search-form";
import { fetchProviders } from "@/lib/supabase/queries";
import { ProviderCard } from "@/components/providers/provider-card";

const stats = [
  { label: "Listings ready", value: "5,000+", description: "Clean provider records curated across Australia." },
  { label: "States covered", value: "8/8", description: "Every state & territory represented from launch." },
  { label: "Moderation SLA", value: "<24h", description: "Reviews checked manually with right-of-reply." },
];

const workflow = [
  {
    title: "1. Capture verified data",
    description:
      "Import from trusted sources, verify ABNs, phone uptime, and funding registrations before publishing.",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    title: "2. Publish PII-safe listings",
    description:
      "Only share provider-approved info on the public directory. Personal contacts stay inside the portal.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "3. Monetise responsibly",
    description:
      "Enable featured placements, paid leads, and review insights without compromising privacy.",
    icon: <Coins className="h-5 w-5" />,
  },
];

const complianceHighlights = [
  "Supabase project hosted in Sydney with Row Level Security protecting every table.",
  "Full audit trail for provider edits, review moderation, and lead handling.",
  "Edge Functions planned for profanity/spam filters before human review.",
];

const learningLinks = [
  {
    title: "Moderation blueprint",
    summary: "How we triage, approve, and take down reviews to prevent defamation.",
    href: "/articles/how-we-moderate-reviews-at-zably",
  },
  {
    title: "Provider onboarding checklist",
    summary: "All the questions we ask before a listing goes live in the directory.",
    href: "/articles/checklists",
  },
];

const providerBenefits = [
  {
    title: "High-intent leads",
    description: "Launch with paid leads + featured placements so revenue starts on day one.",
    metric: "Up to 40% lower CPA vs. generic ads",
  },
  {
    title: "Review playbook",
    description: "Automated intake, moderation queue, right-of-reply, and takedowns handled in-app.",
    metric: "100% moderation coverage",
  },
  {
    title: "Content support",
    description: "SEO, accessibility, and tone-of-voice templates so listings stay compliant and fresh.",
    metric: "Avg +28% organic clicks",
  },
];

const testimonials = [
  {
    quote:
      "Zably gave us a clean profile, pre-screened enquiries, and a clear log of every review decision. It's rare to see SEO and compliance aligned like this.",
    author: "Renee C.",
    role: "Director, Aurora Support Collective",
  },
  {
    quote:
      "We cancelled generic lead marketplaces. Featured placements here are transparent, audit-friendly, and hosted in Australia.",
    author: "Marcus E.",
    role: "GM, Coastal Care Partners",
  },
];

export default async function Home() {
  const { providers } = await fetchProviders({ limit: 6 });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16">
      <section className="grid gap-10 rounded-[32px] bg-gradient-to-r from-indigo-50 via-white to-slate-50 p-10 shadow-xl shadow-indigo-100 md:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
            Trusted since day one
          </span>
          <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
            Australia&rsquo;s cleanest disability services directory.
          </h1>
          <p className="text-lg text-slate-600">
            Zably keeps personal details inside the secure provider portal while
            showcasing public-ready listings for SEO and accessibility. Find
            providers by service, funding, or state in a few clicks.
          </p>
          <DirectorySearchForm />
          <p className="text-sm text-slate-500">
            Need help picking a provider?{" "}
            <Link href="/articles" className="font-semibold text-indigo-600">
              Read our guides
            </Link>
            .
          </p>
        </div>
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
          <h2 className="text-base font-semibold uppercase tracking-wide text-slate-500">
            Privacy-first build
          </h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-indigo-600" />
              Public directory only shows non-identifiable data
            </li>
            <li className="flex items-start gap-2">
              <MapPinned className="mt-0.5 h-4 w-4 text-indigo-600" />
              Provider portal lives on Supabase (Sydney region)
            </li>
            <li className="flex items-start gap-2">
              <Workflow className="mt-0.5 h-4 w-4 text-indigo-600" />
              Row Level Security + audit logs on every table
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 text-indigo-600" />
              Review moderation with human oversight and right-of-reply
            </li>
          </ul>
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {stat.label}
            </p>
            <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-600">{stat.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100 md:grid-cols-3">
        {providerBenefits.map((benefit) => (
          <article key={benefit.title} className="flex h-full flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">{benefit.title}</h3>
            <p className="text-sm text-slate-600">{benefit.description}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{benefit.metric}</p>
          </article>
        ))}
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              How it works
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Built for compliance teams and growth marketers
            </h2>
          </div>
          <Link
            href="/portal"
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700"
          >
            Provider portal preview
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {workflow.map((step) => (
            <div
              key={step.title}
              className="flex h-full flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100"
            >
              <div className="inline-flex size-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Compliance snapshot
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Everything sensitive stays off the public web.
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {complianceHighlights.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Latest guidance
          </h3>
          <ul className="mt-4 space-y-4">
            {learningLinks.map((guide) => (
              <li key={guide.title}>
                <Link href={guide.href} className="text-base font-semibold text-slate-900">
                  {guide.title}
                </Link>
                <p className="text-sm text-slate-600">{guide.summary}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/articles"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
          >
            Browse all articles <BookOpenCheck className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-indigo-100 bg-gradient-to-r from-white via-indigo-50 to-white p-8 shadow-lg shadow-indigo-100 md:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">
            Data residency
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">Sydney-hosted stack with encryption by default.</h2>
          <p className="text-sm text-slate-600">
            Supabase is configured for ap-southeast-2, with object storage per-provider and server-side encryption.
            Service role keys stay on the server, and public pages only hit anonymous keys.
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <GlobeLock className="mt-0.5 h-4 w-4 text-indigo-600" />
              Zero personal details cached in the CDN or browser.
            </li>
            <li className="flex items-start gap-2">
              <Workflow className="mt-0.5 h-4 w-4 text-indigo-600" />
              RLS keeps provider portals siloed and auditable.
            </li>
          </ul>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-semibold text-slate-900">Interested in the portal?</h3>
          <p className="text-sm text-slate-600">
            We provide a Supabase migration pack, schema docs, and environment setup guide for every partner.
          </p>
          <Link
            href="/portal"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
          >
            Explore portal roadmap
          </Link>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <blockquote key={testimonial.author} className="flex h-full flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <Star className="h-6 w-6 text-amber-400" />
            <p className="text-lg text-slate-900">&ldquo;{testimonial.quote}&rdquo;</p>
            <footer className="text-sm font-semibold text-slate-600">
              {testimonial.author} · <span className="font-normal text-slate-500">{testimonial.role}</span>
            </footer>
          </blockquote>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Featured providers
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Fresh listings ready for discovery
            </h2>
            <p className="text-sm text-slate-600">
              Highlight your services, funding options, and coverage areas. Reviews stay moderated and transparent.
            </p>
          </div>
          <Link
            href="/providers"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-200 hover:bg-slate-800"
          >
            View full directory
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
          {providers.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-slate-500">
              Seed the Supabase database to preview featured providers.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
