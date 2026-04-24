import { SidebarNav, SidebarNavItem } from "@/components/layout/sidebar-nav";
import {
  Home,
  Zap,
  Activity,
  Network,
  MapPin,
  Users,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

const electricityNavItems: SidebarNavItem[] = [
  {
    title: "Overview",
    href: "/electricity",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Generation",
    href: "/electricity/generation",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    title: "Transmission",
    href: "/electricity/transmission",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    title: "Distribution",
    href: "/electricity/distribution",
    icon: <Network className="h-4 w-4" />,
  },
  {
    title: "Distribution - Northern",
    href: "/electricity/distribution/northern",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    title: "Distribution - Southern",
    href: "/electricity/distribution/southern",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    title: "Access",
    href: "/electricity/access",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Consumption",
    href: "/electricity/consumption",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: "Reported Challenges",
    href: "/electricity/reported-challenges",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    title: "Report a Challenge",
    href: "/electricity/report-challenge",
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

export function ElectricitySidebar() {
  return <SidebarNav title="Electricity Monitor" items={electricityNavItems} basePath="/electricity" />;
}
