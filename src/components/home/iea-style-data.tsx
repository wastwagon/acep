import Link from "next/link";
import { FileText, Zap, BarChart3, Video, Shield, TrendingUp } from "lucide-react";

const dataTools = [
  {
    title: "Data explorers",
    description: "Data visualisations and interactive tools",
    href: "/oil-revenue",
    icon: TrendingUp,
  },
  {
    title: "Data sets",
    description: "Comprehensive data from across the energy system",
    href: "/contracts",
    icon: FileText,
  },
  {
    title: "Monitoring platforms",
    description: "Real-time tracking of contracts, revenue, and electricity",
    href: "/electricity",
    icon: Zap,
  },
  {
    title: "Reports library",
    description: "Access every report and analysis published by ACEP",
    href: "/research-and-policy-papers",
    icon: BarChart3,
  },
];

export function IEAData() {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-12">Global energy data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dataTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={index}
                href={tool.href}
                className="group text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-acep-primary to-acep-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-acep-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {tool.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
