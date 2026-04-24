import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Zap, BarChart3, Video, Shield, ArrowRight } from "lucide-react";

const platforms = [
  {
    title: "Contract Monitor",
    description: "Track petroleum contracts and agreements. Access detailed information on 15 petroleum contract areas across Ghana.",
    icon: FileText,
    href: "/contracts",
    stats: "15 Contract Areas",
  },
  {
    title: "Electricity Monitor",
    description: "Real-time power sector data. Monitor generation, transmission, distribution, and report electricity issues.",
    icon: Zap,
    href: "/electricity",
    stats: "89.4% National Access",
  },
  {
    title: "Oil Revenue Tracker",
    description: "Comprehensive oil revenue dashboard. Track $9.48B in revenue, 438 projects, and 5.7M beneficiaries.",
    icon: BarChart3,
    href: "/oil-revenue",
    stats: "$9.48B Tracked",
  },
  {
    title: "OilMoneyTV",
    description: "Video documentaries on oil-funded projects. Watch how Ghana's oil revenue is distributed and utilized.",
    icon: Video,
    href: "/videos",
    stats: "100+ Videos",
  },
  {
    title: "OpenTax",
    description: "Promoting tax transparency in Ghana. Track tax collections, report violations, and ensure accountability through whistleblower protection.",
    icon: Shield,
    href: "/tax",
    stats: "GH¢125.4B Revenue",
  },
];

export function PlatformCards() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
        {platforms.map((platform) => (
          <Link key={platform.title} href={platform.href} className="group">
            <Card className="h-full border-slate-200/95 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-acep-primary/25 hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-acep-primary transition-colors group-hover:border-acep-primary/20 group-hover:bg-acep-primary/5">
                    <platform.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-acep-primary group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="font-display text-lg font-medium tracking-tight text-slate-900 group-hover:text-acep-primary transition-colors sm:text-xl">
                  {platform.title}
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  {platform.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {platform.stats}
                  </span>
                  <span className="text-sm font-semibold text-acep-primary">Explore</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Link
          href="/contracts"
          className="inline-flex items-center rounded-full border border-slate-300/90 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-acep-primary/35 hover:text-acep-primary"
        >
          Explore key platforms
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
