"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { revenueAllocation } from "@/lib/data/oil-revenue";
import { Building2, GraduationCap, Heart, Sprout } from "lucide-react";

const categoryIcons = {
  Infrastructure: Building2,
  Education: GraduationCap,
  Health: Heart,
  Agriculture: Sprout,
};

const categoryColors = {
  Infrastructure: {
    bg: "from-acep-primary to-blue-900",
    light: "bg-acep-primary/10",
    text: "text-acep-primary",
  },
  Education: {
    bg: "from-acep-logoPurple to-acep-primary",
    light: "bg-acep-logoPurple/10",
    text: "text-acep-logoPurple",
  },
  Health: {
    bg: "from-acep-secondary to-acep-logoOrange",
    light: "bg-acep-secondary/15",
    text: "text-acep-dark",
  },
  Agriculture: {
    bg: "from-emerald-500 to-teal-600",
    light: "bg-emerald-50",
    text: "text-emerald-800",
  },
};

export function AllocationChart() {
  const totalAmount = revenueAllocation.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Allocation Breakdown */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Allocation by Sector</CardTitle>
          <CardDescription>
            Distribution of oil revenue across key sectors (2010-2024)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {revenueAllocation.map((item) => {
            const Icon = categoryIcons[item.category as keyof typeof categoryIcons];
            const colors = categoryColors[item.category as keyof typeof categoryColors];

            return (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 bg-gradient-to-br ${colors.bg} rounded-lg shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{item.category}</div>
                      <div className="text-sm text-slate-500">{item.projects} projects</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 text-lg">
                      ${item.amount.toLocaleString()}M
                    </div>
                    <div className="text-sm text-slate-500">{item.percentage}%</div>
                  </div>
                </div>
                <ProgressBar
                  percentage={item.percentage}
                  variant={
                    item.category === "Infrastructure" ? "blue" :
                    item.category === "Education" ? "purple" :
                    item.category === "Health" ? "red" :
                    "green"
                  }
                  size="lg"
                  showLabel
                  label={`${item.percentage}%`}
                />
              </div>
            );
          })}

          <div className="pt-4 border-t-2 border-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-slate-900">Total Allocated</span>
              <span className="text-2xl font-bold text-green-600">
                ${totalAmount.toLocaleString()}M
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="space-y-6">
        {revenueAllocation.map((item) => {
          const Icon = categoryIcons[item.category as keyof typeof categoryIcons];
          const colors = categoryColors[item.category as keyof typeof categoryColors];

          return (
            <Card key={item.category} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className={`p-3 bg-gradient-to-br ${colors.bg} rounded-lg shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{item.category}</h3>
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                      ${item.amount.toLocaleString()}M
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{item.projects} projects</span>
                      <span className={`font-semibold ${colors.text}`}>
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
