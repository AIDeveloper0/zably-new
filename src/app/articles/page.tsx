import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, Shield, Sparkles } from "lucide-react";
import { DirectorySearchForm } from "@/components/search/directory-search-form";

const featuredArticles = [
  {
    slug: "ndis-plan-review-checklist",
    title: "NDIS plan review checklist",
    summary:
      "Step-by-step prep for your next plan meeting, including evidence templates and who to invite.",
    minutes: 6,
    category: "Guides",
  },
  {
    slug: "questions-to-ask-a-provider",
    title: "15 questions to ask a new provider",
    summary:
      "A printable script covering safety, staffing, escalation pathways, and cultural fit.",
    minutes: 5,
    category: "Checklists",
  },
  {
    slug: "building-a-review-policy",
    title: "How we moderate reviews at Zably",
    summary:
      "Inside our pre-publication checks, right-of-reply workflow, and take-down response times.",
    minutes: 4,
    category: "Transparency",
  },
];

export default function ArticlesPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-12">
      <section className="space-y-6 rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-10 shadow-lg shadow-slate-100">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
          Learn &amp; share
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">
          Articles &amp; playbooks for safer disability services.
        </h1>
        <p className="text-lg text-slate-600">
          Every post is written with compliance teams and participants in mind.
          Use these as conversation starters, provider onboarding packs, and
          portal announcements.
        </p>
        <DirectorySearchForm
          action="/providers"
          helperLink={null}
          ctaLabel="Search the directory"
        />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Featured reads
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Trending compliance &amp; provider ops advice
            </h2>
          </div>
          <Link
            href="mailto:hello@zably.com.au?subject=Submit%20an%20article"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 underline-offset-4 hover:underline"
          >
            Pitch an article <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredArticles.map((article) => (
            <article
              key={article.slug}
              className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
                {article.category}
              </span>
              <h3 className="text-xl font-semibold text-slate-900">
                {article.title}
              </h3>
              <p className="flex-1 text-sm text-slate-600">{article.summary}</p>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>{article.minutes} min read</span>
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-2 text-indigo-600"
                >
                  Read soon <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100 md:grid-cols-3">
        <ArticleHighlight
          icon={<Shield className="h-6 w-6" />}
          title="Moderation blueprint"
          description="Download a pre-built review pipeline covering auto-filters, triage, and right-of-reply timelines."
          action="Download policy"
        />
        <ArticleHighlight
          icon={<Sparkles className="h-6 w-6" />}
          title="SEO copy prompts"
          description="Content brief templates that keep listings PII-free while boosting accessibility and SERP snippets."
          action="Get prompts"
        />
        <ArticleHighlight
          icon={<BookOpenCheck className="h-6 w-6" />}
          title="Provider onboarding kit"
          description="Checklist for verifying ABNs, phone/email uptime, and recent reviews before publishing."
          action="View checklist"
        />
      </section>
    </div>
  );
}

function ArticleHighlight({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
      <div className="inline-flex size-10 items-center justify-center rounded-full bg-white text-indigo-600 shadow-slate-200">
        {icon}
      </div>
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="flex-1 text-sm text-slate-600">{description}</p>
      <button className="text-sm font-semibold text-indigo-600 underline-offset-4 hover:underline">
        {action}
      </button>
    </div>
  );
}
