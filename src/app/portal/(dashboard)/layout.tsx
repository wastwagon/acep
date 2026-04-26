import Link from "next/link";
import { requirePortalUser } from "@/lib/portal-auth";
import { PortalDashboardNav } from "@/components/portal/portal-dashboard-nav";

export default async function PortalDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePortalUser();
  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/portal" className="font-display text-lg font-semibold text-acep-primary">
            Participant portal
          </Link>
          <PortalDashboardNav email={user.email} />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
