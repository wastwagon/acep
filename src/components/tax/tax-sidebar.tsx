import { SidebarNav, SidebarNavItem } from "@/components/layout/sidebar-nav";
import { Home, DollarSign, TrendingUp, FileText, Shield, BarChart3, Info } from "lucide-react";

const taxNavItems: SidebarNavItem[] = [
  {
    title: "Overview",
    href: "/tax",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Tax Revenue",
    href: "/tax/revenue",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Revenue Trends",
    href: "/tax/trends",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: "Tax Sources",
    href: "/tax/sources",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    title: "Whistleblower",
    href: "/tax/whistleblower",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    title: "Tax Compliance",
    href: "/tax/compliance",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "About OpenTax",
    href: "/tax/about",
    icon: <Info className="h-4 w-4" />,
  },
];

export function TaxSidebar() {
  return <SidebarNav title="OpenTax" items={taxNavItems} basePath="/tax" />;
}
