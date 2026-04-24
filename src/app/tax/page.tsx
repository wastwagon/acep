import { TaxHero } from "@/components/tax/tax-hero";
import { TaxStats } from "@/components/tax/tax-stats";
import { TaxRevenueChart } from "@/components/tax/tax-revenue-chart";
import { TaxSourcesBreakdown } from "@/components/tax/tax-sources-breakdown";
import { WhistleblowerForm } from "@/components/tax/whistleblower-form";
import { SectionHeader } from "@/components/ui/section-header";

export default function TaxPage() {
  return (
    <div className="flex flex-col">
      <TaxHero />

      <TaxStats />

      <section className="border-b border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            className="mb-8 md:mb-12"
            eyebrow="Collections"
            title="Tax revenue overview"
            description="Tracking Ghana&apos;s tax revenue collection trends and performance."
          />
          <TaxRevenueChart />
        </div>
      </section>

      <section className="bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            className="mb-8 md:mb-12"
            eyebrow="Breakdown"
            title="Sources & performance"
            description="Where revenue comes from and how collections compare to targets."
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <TaxSourcesBreakdown />
            <div className="rounded-xl border border-slate-200/90 bg-card text-card-foreground shadow-sm ring-1 ring-slate-950/[0.04]">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Tax collection performance</h3>
                <p className="text-sm text-muted-foreground">Key metrics and achievements</p>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <span className="text-sm font-medium text-slate-700">2024 Target</span>
                    <span className="text-base font-semibold text-slate-900">GH¢120.0B</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <span className="text-sm font-medium text-slate-700">2024 Actual</span>
                    <span className="text-base font-semibold text-emerald-600">GH¢125.4B</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <span className="text-sm font-medium text-slate-700">Performance</span>
                    <span className="text-base font-semibold text-emerald-600">104.5%</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="mb-2 text-sm text-slate-600">Growth rate (2023–2024)</div>
                    <div className="text-2xl font-bold text-acep-primary">+10.9%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <SectionHeader
              className="mb-8 md:mb-12"
              eyebrow="Whistleblower"
              title="Report tax violations"
              description="Help ensure tax compliance. Reports are confidential and protected."
            />
            <WhistleblowerForm />
          </div>
        </div>
      </section>
    </div>
  );
}
