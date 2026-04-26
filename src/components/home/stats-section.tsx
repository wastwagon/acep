import { TrendingUp, Users, FileText, Calendar } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: "$9.48B",
    label: "Oil Revenue Tracked",
    sublabel: "Since 2010",
  },
  {
    icon: FileText,
    value: "438",
    label: "Funded Projects",
    sublabel: "Across Ghana",
  },
  {
    icon: Users,
    value: "5.7M",
    label: "Beneficiaries",
    sublabel: "16.8% of population",
  },
  {
    icon: Calendar,
    value: "14+",
    label: "Years",
    sublabel: "Of transparency advocacy",
  },
];

export function StatsSection() {
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
              <div className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-700 mb-1">
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
