import { ContractsSidebar } from "@/components/contracts/contracts-sidebar";
import { PLATFORM_MAIN_CLASSNAME } from "@/components/layout/platform-main-classes";

export default function ContractsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <ContractsSidebar />
      <main className={PLATFORM_MAIN_CLASSNAME}>{children}</main>
    </div>
  );
}
