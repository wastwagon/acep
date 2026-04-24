import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxSourcesBreakdown } from "@/components/tax/tax-sources-breakdown";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";
import { taxSources } from "@/lib/data/tax";
import { Building2, Package, User, Briefcase, ShoppingCart, Mountain } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Package,
  User,
  Briefcase,
  ShoppingCart,
  Mountain,
};

export default function SourcesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/tax"
        backLabel="Back to OpenTax"
        title="Tax revenue sources"
        subtitle="Detailed breakdown of tax revenue by source and category."
      />

      <section className="border-b border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <TaxSourcesBreakdown />

            {/* Detailed Source Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {taxSources.map((source) => {
                const Icon = iconMap[source.icon] || Building2;
                return (
                  <Card key={source.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="rounded-lg bg-acep-primary/10 p-2">
                          <Icon className="h-5 w-5 text-acep-primary" />
                        </div>
                        {source.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">{source.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">2024 Revenue</span>
                          <span className="font-semibold text-slate-900">
                            GH¢{source.amount.toFixed(1)}B
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Share of Total</span>
                          <span className="font-semibold text-acep-primary">{source.percentage}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Growth Rate</span>
                          <span className="font-semibold text-emerald-700">
                            +{source.growthRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
