import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, GraduationCap, Globe, Award, ArrowRight } from "lucide-react";

const featuredPrograms = [
  {
    name: "Future of Energy Conference",
    href: "/fec-2025",
    icon: Calendar,
    description: "Africa's premier energy conference",
  },
  {
    name: "NextGen Program",
    href: "/nextgen10",
    icon: GraduationCap,
    description: "Empowering future leaders",
  },
  {
    name: "Africa Climate Academy",
    href: "/climate-academy",
    icon: Globe,
    description: "Building climate capacity",
  },
  {
    name: "Resource Governance Hub",
    href: "/rgchub",
    icon: Award,
    description: "Knowledge exchange platform",
  },
];

export function ProgramsOverview() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Our Programs
          </h2>
          <p className="text-base text-slate-600 mb-8">
            Driving change through capacity building, knowledge platforms, and strategic initiatives
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredPrograms.map((program) => {
            const Icon = program.icon;
            return (
              <Link
                key={program.name}
                href={program.href}
                className="group text-center p-6 rounded-xl bg-white border-2 border-slate-100 hover:border-acep-primary hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-acep-primary to-acep-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-acep-primary transition-colors">
                  {program.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {program.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/programs">
            <Button variant="outline" className="border-acep-primary text-acep-primary hover:bg-acep-primary hover:text-white">
              Explore All Programs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
