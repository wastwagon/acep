import Link from "next/link";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-8 mb-8">
        {platforms.map((platform) => (
          <Link key={platform.title} href={platform.href} className="group flex h-full min-h-0">
            <Card className="w-full border-slate-200/95 bg-white transition-shadow duration-200 hover:border-acep-primary/35 hover:shadow-[0_6px_20px_-6px_rgba(15,23,42,0.12)]">
              <CardHeader>
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-acepBtn border border-slate-200 bg-slate-50 p-3 text-acep-primary transition-colors group-hover:border-acep-primary/25 group-hover:bg-acep-primary/[0.06]">
                    <platform.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-acep-primary" />
                </div>
                <CardTitle className="font-display text-lg font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-acep-primary sm:text-xl">
                  {platform.title}
                </CardTitle>
                <CardDescription className="mt-2 text-sm leading-relaxed text-slate-600">{platform.description}</CardDescription>
              </CardHeader>
              <div className="min-h-0 flex-1" aria-hidden />
              <CardFooter className="justify-between gap-3">
                <span className="institutional-chip">{platform.stats}</span>
                <span className="text-sm font-semibold text-acep-primary">Explore</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Link
          href="/contracts"
          className="institutional-link inline-flex items-center px-6 py-3 text-sm shadow-sm"
        >
          Explore key platforms
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
