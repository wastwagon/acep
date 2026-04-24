import { OilRevenueSidebar } from "@/components/oil-revenue/oil-revenue-sidebar";
import { PLATFORM_MAIN_CLASSNAME } from "@/components/layout/platform-main-classes";

export default function OilRevenueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <OilRevenueSidebar />
      <main className={PLATFORM_MAIN_CLASSNAME}>{children}</main>
    </div>
  );
}
