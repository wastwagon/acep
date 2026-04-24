import { ContractsHero } from "@/components/contracts/contracts-hero";
import { ContractsGrid } from "@/components/contracts/contracts-grid";
import { ContractsMap } from "@/components/contracts/contracts-map";
import { ContractsStats } from "@/components/contracts/contracts-stats";
import { SectionHeader } from "@/components/ui/section-header";

export default function ContractsPage() {
  return (
    <div className="flex flex-col">
      <ContractsHero />

      <ContractsStats />

      <section id="contract-areas-map" className="border-b border-slate-200 bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            className="mb-8 md:mb-12"
            eyebrow="Geography"
            title="Contract areas map"
            description="Explore Ghana&apos;s petroleum contract areas geographically."
          />
          <ContractsMap />
        </div>
      </section>

      <section className="bg-slate-50/80 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            className="mb-8 md:mb-12"
            eyebrow="Data"
            title="Petroleum contract areas"
            description="Browse all 15 petroleum contract areas in Ghana with detailed information."
          />
          <ContractsGrid />
        </div>
      </section>
    </div>
  );
}
