import { FileText, MapPin, Building2, Activity } from "lucide-react";
import { contractAreas, getTotalContractArea, getActiveContracts } from "@/lib/data/contracts";

export function ContractsStats() {
  const totalArea = getTotalContractArea();
  const activeContracts = getActiveContracts().length;
  const totalOperators = new Set(
    contractAreas.flatMap((contract) => contract.operators)
  ).size;

  const stats = [
    {
      icon: FileText,
      value: contractAreas.length,
      label: "Contract Areas",
      sublabel: "Total petroleum blocks",
    },
    {
      icon: Activity,
      value: activeContracts,
      label: "Active Contracts",
      sublabel: "Currently producing",
    },
    {
      icon: MapPin,
      value: `${totalArea.toLocaleString()} km²`,
      label: "Total Coverage",
      sublabel: "Contract area size",
    },
    {
      icon: Building2,
      value: totalOperators,
      label: "Operators",
      sublabel: "Unique companies",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white -mt-8 relative z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-50 to-white p-4 sm:p-6 rounded-acepCard border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 sm:p-3 bg-acep-primary/10 rounded-acepBtn">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-acep-primary" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base font-medium text-slate-700 mb-1">
                {stat.label}
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
