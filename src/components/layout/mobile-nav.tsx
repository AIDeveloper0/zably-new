"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck, Star } from "lucide-react";
import { siteConfig } from "@/config/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-white transition md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col rounded-l-3xl shadow-2xl transition md:hidden">
            <div className="absolute inset-0 rounded-l-3xl bg-white" aria-hidden />
            <div className="relative flex h-full flex-col rounded-l-3xl bg-amber-100">
              <div className="flex items-center justify-between border-b border-amber-200 px-5 py-4">
                <p className="relative text-lg font-semibold text-slate-900">
                  <span className="absolute inset-x-[-12px] inset-y-[-6px] -z-10 rounded-2xl bg-indigo-50" />
                  Navigation
                </p>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-slate-200 p-2 text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-3 px-5 py-6 text-base font-medium text-slate-800">
                {siteConfig.navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm transition hover:bg-amber-100"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="space-y-4 border-t border-amber-200 px-5 py-6">
                <div className="rounded-2xl border border-amber-200 bg-white/80 p-4 text-sm text-slate-600">
                  <p className="flex items-center gap-2 font-semibold text-slate-900">
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    AUS-hosted portal
                  </p>
                  <p>Supabase (Sydney), RLS enforced, audit-ready.</p>
                </div>
                <Link
                  href="/providers"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full border border-amber-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800"
                >
                  Browse directory
                </Link>
                <Link
                  href="/portal"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-200"
                >
                  <Star className="h-4 w-4" />
                  Provider portal
                </Link>
                <p className="text-center text-xs text-slate-500">
                  Need help?{" "}
                  <Link href="mailto:hello@zably.com.au" className="font-semibold text-indigo-600">
                    hello@zably.com.au
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
