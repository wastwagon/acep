import { Target, Lightbulb, TrendingUp, Users } from "lucide-react";

const focusAreas = [
  {
    icon: Target,
    title: "Oil & Gas",
    description: "Promoting transparency in petroleum contracts and revenue management",
  },
  {
    icon: Lightbulb,
    title: "Power",
    description: "Monitoring electricity generation, transmission, and distribution",
  },
  {
    icon: TrendingUp,
    title: "Fiscal Governance",
    description: "Ensuring accountable use of extractive sector revenues",
  },
  {
    icon: Users,
    title: "Climate Change & Energy Transition",
    description: "Advocating for sustainable energy solutions and climate action",
  },
];

export function MissionSection() {
  return (
    <section className="bg-slate-50/50 py-14 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-4xl text-center md:mb-14">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Research Priorities</p>
          <h2 className="font-display mb-5 text-3xl font-medium tracking-[-0.02em] text-slate-900 md:text-[2.15rem]">
            Our Focus Areas
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600">
            Oil & Gas, Power, Mining, Fiscal Governance, Climate Change & Energy Transition
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {focusAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <div
                key={index}
                className="group rounded-acepCard border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-acep-primary/30 hover:shadow-sm"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-acepBtn border border-slate-200 bg-slate-50 p-3 text-acep-primary transition-colors group-hover:border-acep-primary/20 group-hover:bg-acep-primary/5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-acep-primary">
                    {area.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-600">
                    {area.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
