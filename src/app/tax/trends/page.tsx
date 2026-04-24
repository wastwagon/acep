"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { taxRevenueData } from "@/lib/data/tax";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TrendsPage() {
  const chartData = taxRevenueData.map((r) => ({
    year: r.year.toString(),
    total: r.totalRevenue,
    growth: r.growthRate,
    taxToGDP: r.taxToGDP,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/tax"
        backLabel="Back to OpenTax"
        title="Revenue trends"
        subtitle="Historical trends and analysis of Ghana&apos;s tax revenue performance."
      />

      <section className="border-b border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Growth Rate Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Revenue Growth Trends</CardTitle>
                <CardDescription>
                  Year-over-year growth rate and tax-to-GDP ratio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value: number, name: string) => {
                          if (name === "growth") return `${value.toFixed(1)}%`;
                          if (name === "taxToGDP") return `${value.toFixed(1)}%`;
                          return `GH¢${value.toFixed(1)}B`;
                        }}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="total" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        name="Total Revenue (GH¢B)"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="growth" 
                        stroke="#f97316" 
                        strokeWidth={2}
                        name="Growth Rate (%)"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="taxToGDP" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Tax to GDP (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Historical Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Historical Revenue Data (2019-2024)</CardTitle>
                <CardDescription>
                  Complete breakdown of tax revenue collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Year</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Total (GH¢B)</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Domestic</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Customs</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Growth</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Tax/GDP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxRevenueData.map((r) => (
                        <tr key={r.year} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">{r.year}</td>
                          <td className="py-3 px-4 text-right font-semibold">{r.totalRevenue.toFixed(1)}</td>
                          <td className="py-3 px-4 text-right">{r.domesticTax.toFixed(1)}</td>
                          <td className="py-3 px-4 text-right">{r.customsTax.toFixed(1)}</td>
                          <td className={`py-3 px-4 text-right font-medium ${r.growthRate > 0 ? "text-emerald-700" : "text-rose-700"}`}>
                            {r.growthRate > 0 ? "+" : ""}{r.growthRate.toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-right">{r.taxToGDP.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
