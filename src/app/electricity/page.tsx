import { ElectricityHero } from "@/components/electricity/electricity-hero";
import { ElectricityStats } from "@/components/electricity/electricity-stats";
import { PowerPlantsTable } from "@/components/electricity/power-plants-table";
import { CapacityChart } from "@/components/electricity/capacity-chart";
import { ComplaintForm } from "@/components/electricity/complaint-form";
import { SectionHeader } from "@/components/ui/section-header";

export default function ElectricityPage() {
  return (
    <div className="flex flex-col">
      <ElectricityHero />

      <ElectricityStats />

      <section className="border-b border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            className="mb-8 md:mb-12"
            eyebrow="Generation"
            title="Power generation overview"
            description="Ghana&apos;s electricity generation capacity breakdown by type."
          />
          <CapacityChart />
        </div>
      </section>

      <section className="bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            className="mb-8 md:mb-12"
            eyebrow="Infrastructure"
            title="Power generation plants"
            description="Operational power plants across Ghana."
          />
          <PowerPlantsTable />
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <SectionHeader
              className="mb-8 md:mb-12"
              eyebrow="Citizen reporting"
              title="Report power issues"
              description="Help improve Ghana&apos;s power sector by reporting electricity challenges in your area."
            />
            <ComplaintForm />
          </div>
        </div>
      </section>
    </div>
  );
}
