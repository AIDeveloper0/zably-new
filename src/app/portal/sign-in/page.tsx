import Link from "next/link";
import { PortalSignInForm } from "@/components/portal/sign-in-form";

export default function PortalSignInPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-lg flex-col gap-6 px-4 py-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Provider portal
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Sign in with a secure link
        </h1>
        <p className="text-sm text-slate-600">
          Enter the email associated with your provider account. We’ll send a
          one-time magic link that expires in 5 minutes. Need access?{" "}
          <Link className="font-semibold text-indigo-600" href="mailto:hello@zably.com.au">
            Contact the admin team
          </Link>
          .
        </p>
      </div>
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
        <PortalSignInForm />
      </div>
      <p className="text-center text-xs text-slate-500">
        Data hosted securely in Sydney (Supabase). Personal information never appears on the public site.
      </p>
    </div>
  );
}
