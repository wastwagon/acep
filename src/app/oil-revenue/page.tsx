import { OilRevenueHero } from "@/components/oil-revenue/oil-revenue-hero";
import { OilRevenueStats } from "@/components/oil-revenue/oil-revenue-stats";
import { RevenueDashboard } from "@/components/oil-revenue/revenue-dashboard";
import { ProjectsGrid } from "@/components/oil-revenue/projects-grid";
import { AllocationChart } from "@/components/oil-revenue/allocation-chart";
import { SectionHeader } from "@/components/ui/section-header";

export default function OilRevenuePage() {
  return (
    <div className="flex flex-col">
      <OilRevenueHero />

      <OilRevenueStats />

      <section className="border-b border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            className="mb-8 md:mb-12"
            eyebrow="Dashboard"
            title="Ghana oil revenue dashboard"
            description="Tracking and visualizing Ghana&apos;s oil revenue since production began in 2010."
          />
          <RevenueDashboard />
        </div>
      </section>

      <section className="bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            className="mb-8 md:mb-12"
            eyebrow="Allocation"
            title="Revenue allocation"
            description="How Ghana&apos;s oil revenue is distributed across sectors."
          />
          <AllocationChart />
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            className="mb-8 md:mb-12"
            eyebrow="Impact"
            title="Impactful projects"
            description="Oil-funded projects transforming communities across Ghana."
          />
          <ProjectsGrid />
        </div>
      </section>
    </div>
  );
}
