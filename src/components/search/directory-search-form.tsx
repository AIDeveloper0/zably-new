import { Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type DirectorySearchFormProps = {
  defaultValue?: string;
  className?: string;
  action?: string;
  ctaLabel?: string;
  helperLink?: { label: string; href: string } | null;
};

export function DirectorySearchForm({
  defaultValue = "",
  className,
  action = "/providers",
  ctaLabel = "Search providers",
  helperLink = { label: "Advanced filters", href: "/providers" },
}: DirectorySearchFormProps) {
  return (
    <form
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white/90 p-4 shadow-lg shadow-indigo-50 backdrop-blur",
        className
      )}
      action={action}
      method="get"
    >
      <label className="text-sm font-medium text-slate-600">
        Search by service, suburb, or provider name
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-inner shadow-slate-100 focus-within:border-indigo-500">
          <Search className="h-4 w-4 text-slate-500" aria-hidden />
          <input
            type="search"
            name="q"
            defaultValue={defaultValue}
            placeholder="e.g. OT in Melbourne or plan manager"
            className="w-full border-0 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500"
        >
          {ctaLabel}
        </button>
      </div>
      {helperLink && (
        <p className="text-sm text-slate-500">
          or{" "}
          <Link
            href={helperLink.href}
            className="font-semibold text-indigo-600 underline-offset-4 hover:underline"
          >
            {helperLink.label}
          </Link>
        </p>
      )}
    </form>
  );
}
