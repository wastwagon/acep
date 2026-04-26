import { Zap, Users, Home, Building2 } from "lucide-react";
import { electricityStats } from "@/lib/data/electricity";
import { formatNumber } from "@/lib/utils";

export function ElectricityStats() {
  const stats = [
    {
      icon: Zap,
      value: `${electricityStats.nationalAccess}%`,
      label: "National Access",
      sublabel: "Population coverage",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Home,
      value: `${electricityStats.ruralAccess}%`,
      label: "Rural Access",
      sublabel: "Rural coverage",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Building2,
      value: `${electricityStats.urbanAccess}%`,
      label: "Urban Access",
      sublabel: "Urban coverage",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: Users,
      value: formatNumber(electricityStats.totalCustomers),
      label: "Total Customers",
      sublabel: "As of 2022",
      color: "from-orange-500 to-red-600",
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
                <div className={`p-2 sm:p-3 bg-gradient-to-br ${stat.color} rounded-acepBtn shadow-lg`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
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

        {/* Additional Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-acepCard p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Power Sector Insight & Complaints Made Easy
              </h3>
              <p className="text-sm text-slate-600">
                The Electricity Monitor empowers stakeholders to track and engage with Ghana&apos;s power sector
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="text-center bg-white px-4 py-2 rounded-acepBtn shadow-sm">
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(electricityStats.totalInstalledCapacity)} MW
                </div>
                <div className="text-xs text-slate-600">Installed Capacity</div>
              </div>
              <div className="text-center bg-white px-4 py-2 rounded-acepBtn shadow-sm">
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(electricityStats.totalDependableCapacity)} MW
                </div>
                <div className="text-xs text-slate-600">Dependable Capacity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
