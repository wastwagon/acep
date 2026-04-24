import { ElectricitySidebar } from "@/components/electricity/electricity-sidebar";
import { PLATFORM_MAIN_CLASSNAME } from "@/components/layout/platform-main-classes";

export default function ElectricityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <ElectricitySidebar />
      <main className={PLATFORM_MAIN_CLASSNAME}>{children}</main>
    </div>
  );
}
