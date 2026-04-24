import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxRevenueChart } from "@/components/tax/tax-revenue-chart";
import { PlatformSubpageHero } from "@/components/layout/platform-subpage-hero";
import { TaxSourcesBreakdown } from "@/components/tax/tax-sources-breakdown";
import { getLatestRevenue } from "@/lib/data/tax";

export default function RevenuePage() {
  const latest = getLatestRevenue();

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformSubpageHero
        backHref="/tax"
        backLabel="Back to OpenTax"
        title="Tax revenue collection"
        subtitle="Comprehensive overview of Ghana&apos;s tax revenue collection performance."
      />

      <section className="border-b border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2024 Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-acep-primary">
                  GH¢{latest.totalRevenue.toFixed(1)}B
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {latest.growthRate > 0 ? "+" : ""}{latest.growthRate.toFixed(1)}% from 2023
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tax to GDP Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-acep-logoPurple">
                  {latest.taxToGDP.toFixed(1)}%
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Highest in 6 years
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-acep-secondary">
                  {latest.growthRate > 0 ? "+" : ""}{latest.growthRate.toFixed(1)}%
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Year-over-year growth
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <TaxRevenueChart />
            <TaxSourcesBreakdown />
          </div>

          {/* Revenue Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Revenue Breakdown (2024)</CardTitle>
              <CardDescription>
                Tax revenue by category in GH¢ Billions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">Amount (GH¢B)</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">Percentage</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">Domestic Tax Revenue</td>
                      <td className="py-3 px-4 text-right font-semibold">{latest.domesticTax.toFixed(1)}</td>
                      <td className="py-3 px-4 text-right text-slate-600">73.0%</td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-700">+10.9%</td>
                    </tr>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">Customs Revenue</td>
                      <td className="py-3 px-4 text-right font-semibold">{latest.customsTax.toFixed(1)}</td>
                      <td className="py-3 px-4 text-right text-slate-600">27.0%</td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-700">+10.8%</td>
                    </tr>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">Personal Income Tax</td>
                      <td className="py-3 px-4 text-right font-semibold">{latest.personalIncomeTax.toFixed(1)}</td>
                      <td className="py-3 px-4 text-right text-slate-600">16.0%</td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-700">+10.4%</td>
                    </tr>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">Corporate Income Tax</td>
                      <td className="py-3 px-4 text-right font-semibold">{latest.corporateIncomeTax.toFixed(1)}</td>
                      <td className="py-3 px-4 text-right text-slate-600">14.0%</td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-700">+10.8%</td>
                    </tr>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">Value Added Tax (VAT)</td>
                      <td className="py-3 px-4 text-right font-semibold">{latest.vat.toFixed(1)}</td>
                      <td className="py-3 px-4 text-right text-slate-600">22.0%</td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-700">+11.0%</td>
                    </tr>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">Mineral Royalties</td>
                      <td className="py-3 px-4 text-right font-semibold">{latest.mineralRoyalties.toFixed(1)}</td>
                      <td className="py-3 px-4 text-right text-slate-600">6.0%</td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-700">+10.3%</td>
                    </tr>
                    <tr className="bg-slate-50 font-semibold">
                      <td className="py-3 px-4">Total Revenue</td>
                      <td className="py-3 px-4 text-right font-semibold text-acep-primary">{latest.totalRevenue.toFixed(1)}</td>
                      <td className="py-3 px-4 text-right">100.0%</td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-700">+{latest.growthRate.toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
