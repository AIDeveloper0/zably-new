import Link from "next/link";
import { CheckCircle2, Lock, UserRoundCog } from "lucide-react";
import { DirectorySearchForm } from "@/components/search/directory-search-form";

const roadmapItems = [
  {
    title: "Provider logins",
    description:
      "Supabase Auth with email magic links and optional passkeys. RLS keeps each listing isolated.",
    status: "Ready",
  },
  {
    title: "Listing editor",
    description:
      "Edit services, funding, media, and locations with moderation checkpoints for public content.",
    status: "In build",
  },
  {
    title: "Lead inbox",
    description:
      "Secure message centre with audit logs and export tools to sync into CRMs.",
    status: "Next",
  },
];

export default function PortalPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-12">
      <section className="space-y-6 rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-10 shadow-lg shadow-slate-100">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Provider portal (Week 2)
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">
          Manage listings, leads, and reviews securely in Australia.
        </h1>
        <p className="text-lg text-slate-600">
          The portal runs on Supabase (Sydney region) with Row Level Security,
          encrypted storage, and full audit logging. Personal or client data
          never touches the public-facing site.
        </p>
        <div className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-inner shadow-slate-100 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Coming soon
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-600" />
                MFA-ready magic link sign-in
              </li>
              <li className="flex items-center gap-2">
                <UserRoundCog className="h-4 w-4 text-indigo-600" />
                Role-based dashboards (provider / admin)
              </li>
            </ul>
          </div>
          <DirectorySearchForm helperLink={null} ctaLabel="Back to public site" />
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100">
        <h2 className="text-2xl font-semibold text-slate-900">
          Portal roadmap
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {roadmapItems.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-6"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                {item.status}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-8 text-slate-900">
        <h3 className="text-xl font-semibold">Want early access?</h3>
        <p className="mt-2 text-sm text-slate-700">
          We are onboarding a small batch of providers for Week 2 testing.
          Confirm your Supabase org, ABN details, and key contacts.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="mailto:hello@zably.com.au?subject=Portal%20access%20request"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
          >
            Request invite
          </Link>
          <Link
            href="/articles"
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700"
          >
            View moderation policy
          </Link>
        </div>
      </section>
    </div>
  );
}
