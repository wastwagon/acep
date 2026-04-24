import { TaxSidebar } from "@/components/tax/tax-sidebar";
import { PLATFORM_MAIN_CLASSNAME } from "@/components/layout/platform-main-classes";

export default function TaxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <TaxSidebar />
      <main className={PLATFORM_MAIN_CLASSNAME}>{children}</main>
    </div>
  );
}
