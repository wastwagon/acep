"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
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

export function TaxSourcesBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Sources Breakdown</CardTitle>
        <CardDescription>
          Tax revenue by source (2024)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {taxSources.map((source) => {
            const Icon = iconMap[source.icon] || Building2;
            return (
              <div key={source.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-acep-primary/10 p-2">
                      <Icon className="h-4 w-4 text-acep-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700">{source.name}</span>
                      <div className="text-xs text-slate-500">{source.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-acep-primary">
                      GH¢{source.amount.toFixed(1)}B
                    </span>
                    <div className="text-xs text-slate-500">{source.percentage}%</div>
                  </div>
                </div>
                <ProgressBar
                  percentage={source.percentage}
                  variant="primary"
                  size="md"
                />
                <div className="mt-1 text-xs text-slate-500">
                  {source.growthRate > 0 ? "+" : ""}{source.growthRate.toFixed(1)}% growth
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
