import { DollarSign, TrendingUp, Briefcase, Users } from "lucide-react";
import { oilRevenueStats } from "@/lib/data/oil-revenue";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function OilRevenueStats() {
  const stats = [
    {
      icon: TrendingUp,
      value: formatCurrency(oilRevenueStats.currentProduction),
      label: "Production",
      sublabel: "Barrels Per Day",
      change: `+${oilRevenueStats.productionGrowth}% from 2023`,
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: DollarSign,
      value: `$${(oilRevenueStats.totalRevenue / 1000).toFixed(2)}B`,
      label: "Total Revenue",
      sublabel: "Since 2010",
      change: "+8.7% annual growth",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Briefcase,
      value: oilRevenueStats.totalProjects,
      label: "Funded Projects",
      sublabel: "Across Ghana",
      change: "+22% in rural areas",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: Users,
      value: `${(oilRevenueStats.totalBeneficiaries / 1000000).toFixed(1)}M`,
      label: "Beneficiaries",
      sublabel: "Ghanaians",
      change: `${oilRevenueStats.beneficiariesPercentage}% of population`,
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white -mt-8 relative z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-50 to-white p-4 sm:p-6 rounded-lg border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 sm:p-3 bg-gradient-to-br ${stat.color} rounded-lg shadow-lg`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base font-medium text-slate-700 mb-1">
                {stat.label}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 mb-2">
                {stat.sublabel}
              </div>
              <div className="text-xs text-green-600 font-medium">
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
