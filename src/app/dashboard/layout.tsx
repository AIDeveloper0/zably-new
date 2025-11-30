import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSessionWithProfile } from "@/lib/supabase/auth";
import { PortalHeader } from "@/components/portal/portal-header";
import { PortalSidebar } from "@/components/portal/portal-sidebar";

export const metadata = {
  title: "Provider Dashboard · Zably",
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { session, profile } = await getSessionWithProfile();

  if (!session) {
    redirect("/portal/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <PortalHeader profile={profile} />
      <div className="flex flex-1">
        <PortalSidebar role={profile?.role} />
        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
