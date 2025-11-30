"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const baseLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/listing", label: "Listing" },
  { href: "/dashboard/reviews", label: "Reviews" },
  { href: "/dashboard/leads", label: "Leads" },
];

const adminLinks = [
  { href: "/dashboard/moderation", label: "Moderation" },
  { href: "/dashboard/audit", label: "Audit log" },
];

export function PortalSidebar({ role }: { role?: string | null }) {
  const pathname = usePathname();
  const links = role === "admin" || role === "moderator" ? [...baseLinks, ...adminLinks] : baseLinks;

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:block">
      <nav className="space-y-1 text-sm font-semibold text-slate-600">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block rounded-xl px-3 py-2 transition",
                active
                  ? "bg-slate-900 text-white"
                  : "hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
