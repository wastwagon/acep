import { requireCmsUser } from "@/lib/cms-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCmsUser();
  const publicBaseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.acep.africa").replace(/\/$/, "");
  return (
    <div className="w-full max-w-[100rem] border-t border-slate-200/90 bg-slate-100/40 lg:mx-auto lg:flex">
      <AdminSidebar userEmail={user.email} role={user.role} publicBaseUrl={publicBaseUrl} />
      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:min-h-[min(100dvh,1200px)]">{children}</div>
    </div>
  );
}
