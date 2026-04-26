import Link from "next/link";
import { Droplet, Zap, TrendingUp, Globe, Shield, Users } from "lucide-react";

const topics = [
  { name: "Oil & Gas", href: "/topics/oil-gas", icon: Droplet },
  { name: "Power & Electricity", href: "/topics/power", icon: Zap },
  { name: "Mining", href: "/topics/mining", icon: TrendingUp },
  { name: "Fiscal Governance", href: "/topics/fiscal", icon: Shield },
  { name: "Climate Change", href: "/topics/climate", icon: Globe },
  { name: "Resource Governance", href: "/topics/governance", icon: Users },
];

export function IEATopics() {
  return (
    <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Trending topics</h2>
          <Link href="/topics" className="text-acep-primary hover:underline font-semibold">
            Topics
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <Link
                key={topic.name}
                href={topic.href}
                className="group text-center p-6 rounded-acepCard bg-white border-2 border-slate-200 hover:border-acep-primary hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-acepBtn bg-gradient-to-br from-acep-primary to-acep-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-acep-primary transition-colors">
                  {topic.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
