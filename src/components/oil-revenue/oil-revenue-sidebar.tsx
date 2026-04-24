import { SidebarNav, SidebarNavItem } from "@/components/layout/sidebar-nav";
import { Home, DollarSign, TrendingUp, Building2, FileText, Mail } from "lucide-react";

const oilRevenueNavItems: SidebarNavItem[] = [
  {
    title: "Overview",
    href: "/oil-revenue",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Collection",
    href: "/oil-revenue/collection",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Allocation",
    href: "/oil-revenue/allocation",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: "Management",
    href: "/oil-revenue/management",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    title: "Projects",
    href: "/oil-revenue/projects",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Resource Centre",
    href: "/oil-revenue/resource-centre",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Contact Us",
    href: "/oil-revenue/contact",
    icon: <Mail className="h-4 w-4" />,
  },
];

export function OilRevenueSidebar() {
  return <SidebarNav title="Our Oil Money" items={oilRevenueNavItems} basePath="/oil-revenue" />;
}
