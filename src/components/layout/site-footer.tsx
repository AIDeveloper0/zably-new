import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-slate-900">{siteConfig.name}</p>
          <p className="text-sm text-slate-600">{siteConfig.description}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Directory
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/providers" className="hover:text-slate-900">
                Search providers
              </Link>
            </li>
            <li>
              <Link href="/articles" className="hover:text-slate-900">
                Guides &amp; articles
              </Link>
            </li>
            <li>
              <Link href="/portal" className="hover:text-slate-900">
                Provider portal
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Compliance
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Data hosted in Sydney (Supabase)</li>
            <li>RLS-protected provider portal</li>
            <li>
              Contact{" "}
              <a
                className="font-semibold text-slate-900"
                href={`mailto:${siteConfig.contactEmail}`}
              >
                {siteConfig.contactEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
