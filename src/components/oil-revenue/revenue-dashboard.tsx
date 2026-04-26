"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { annualRevenue, oilRevenueStats } from "@/lib/data/oil-revenue";
import { TrendingUp, DollarSign } from "lucide-react";

export function RevenueDashboard() {
  const [timeframe, setTimeframe] = useState<"all" | "recent">("all");
  
  const displayData = timeframe === "all" 
    ? annualRevenue 
    : annualRevenue.slice(-5); // Last 5 years

  const maxAmount = Math.max(...displayData.map((d) => d.amount));

  return (
    <div className="space-y-6">
      {/* Timeframe Filter */}
      <div className="flex justify-center space-x-3">
        <Button
          variant={timeframe === "all" ? "default" : "outline"}
          onClick={() => setTimeframe("all")}
          size="sm"
        >
          All Time
        </Button>
        <Button
          variant={timeframe === "recent" ? "default" : "outline"}
          onClick={() => setTimeframe("recent")}
          size="sm"
        >
          Last 5 Years
        </Button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Annual Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Annual Revenue (USD M)
            </CardTitle>
            <CardDescription>
              Oil revenue collected each year {timeframe === "all" ? "since 2010" : "(last 5 years)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayData.map((data) => (
                <div key={data.year}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{data.year}</span>
                    <span className="text-sm font-semibold text-green-600">
                      ${data.amount}M
                    </span>
                  </div>
                  <ProgressBar
                    percentage={(data.amount / maxAmount) * 100}
                    variant={data.year === oilRevenueStats.peakYear ? "yellow" : "green"}
                    size="sm"
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Total ({timeframe === "all" ? "2010-2024" : "Last 5 yrs"})</span>
                <span className="text-lg font-bold text-green-600">
                  ${displayData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}M
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production & Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-acep-primary" />
              Key Metrics
            </CardTitle>
            <CardDescription>
              Important indicators and milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-acepCard border border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/80 p-4">
                <div className="mb-1 text-sm text-slate-600">Total Revenue</div>
                <div className="text-2xl font-bold text-emerald-800">
                  ${(oilRevenueStats.totalRevenueSince2010 / 1000).toFixed(2)}B
                </div>
                <div className="text-xs text-slate-500 mt-1">Since 2010</div>
              </div>

              <div className="rounded-acepCard border border-slate-200 bg-gradient-to-br from-slate-50 to-acep-primary/10 p-4">
                <div className="mb-1 text-sm text-slate-600">Average Annual</div>
                <div className="text-2xl font-bold text-acep-primary">
                  ${oilRevenueStats.averageAnnualRevenue}M
                </div>
                <div className="text-xs text-slate-500 mt-1">Per year</div>
              </div>

              <div className="rounded-acepCard border border-slate-200 bg-gradient-to-br from-amber-50/80 to-acep-secondary/10 p-4">
                <div className="mb-1 text-sm text-slate-600">Peak Revenue</div>
                <div className="text-2xl font-bold text-acep-dark">
                  ${oilRevenueStats.peakRevenue}M
                </div>
                <div className="text-xs text-slate-500 mt-1">Highest in {oilRevenueStats.peakYear}</div>
              </div>

              <div className="rounded-acepCard border border-slate-200 bg-gradient-to-br from-slate-50 to-acep-logoPurple/10 p-4">
                <div className="mb-1 text-sm text-slate-600">Active Projects</div>
                <div className="text-2xl font-bold text-acep-logoPurple">
                  {oilRevenueStats.activeProjects}
                </div>
                <div className="text-xs text-slate-500 mt-1">Across 5 categories</div>
              </div>
            </div>

            <div className="rounded-acepCard border border-slate-200 bg-slate-50 p-4">
              <h4 className="mb-2 text-sm font-semibold text-slate-900">Production Trends</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Current Production:</span>
                  <span className="font-semibold text-slate-900">
                    {oilRevenueStats.currentProduction.toLocaleString()} bpd
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Growth Rate:</span>
                  <span className="font-semibold text-green-600">
                    +{oilRevenueStats.productionGrowth}%
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 rounded p-3">
              <strong>Note:</strong> This dashboard displays Ghana&apos;s oil revenue data since production began in 2010. All monetary values are shown in USD. Data is updated quarterly.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
