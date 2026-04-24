import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Zap, BarChart3, Video, Shield, ArrowRight } from "lucide-react";

const platforms = [
  {
    title: "Contract Monitor",
    href: "/contracts",
    icon: FileText,
    stat: "15 Contract Areas",
  },
  {
    title: "Electricity Monitor",
    href: "/electricity",
    icon: Zap,
    stat: "89.4% National Access",
  },
  {
    title: "Oil Revenue Tracker",
    href: "/oil-revenue",
    icon: BarChart3,
    stat: "$9.48B Tracked",
  },
  {
    title: "OilMoneyTV",
    href: "/videos",
    icon: Video,
    stat: "100+ Videos",
  },
  {
    title: "OpenTax",
    href: "/tax",
    icon: Shield,
    stat: "GH¢125.4B Revenue",
  },
];

export function PlatformsOverview() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Our Platforms
          </h2>
          <p className="text-base text-slate-600">
            Access comprehensive data and insights across Ghana&apos;s energy sector through our specialized monitoring platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <Link
                key={platform.title}
                href={platform.href}
                className="group p-6 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-acep-primary hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-acep-primary to-acep-secondary">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-acep-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-acep-primary transition-colors">
                  {platform.title}
                </h3>
                <p className="text-sm text-acep-primary font-semibold">
                  {platform.stat}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/platforms">
            <Button className="bg-gradient-to-r from-acep-primary to-acep-secondary hover:shadow-lg">
              Explore All Platforms
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
