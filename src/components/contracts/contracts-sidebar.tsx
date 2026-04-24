import { SidebarNav, SidebarNavItem } from "@/components/layout/sidebar-nav";
import { Home, Map, FileText, BarChart3 } from "lucide-react";

const contractsNavItems: SidebarNavItem[] = [
  {
    title: "Overview",
    href: "/contracts",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "All Contracts",
    href: "/contracts",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Contract Map",
    href: "/contracts#map",
    icon: <Map className="h-4 w-4" />,
  },
  {
    title: "Statistics",
    href: "/contracts#stats",
    icon: <BarChart3 className="h-4 w-4" />,
  },
];

export function ContractsSidebar() {
  return <SidebarNav title="Contract Monitor" items={contractsNavItems} basePath="/contracts" />;
}
