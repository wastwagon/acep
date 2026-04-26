import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, GraduationCap, Users, Globe, Award, Building, DollarSign, ArrowRight, Sparkles } from "lucide-react";

const programItems = [
  {
    title: "Future of Energy Conference",
    description: "Join Africa's premier energy conference bringing together policymakers, industry leaders, and researchers.",
    href: "/fec-2025",
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
    badge: "2025",
  },
  {
    title: "NextGen Program",
    description: "Empowering the next generation of resource governance leaders through mentorship and capacity building.",
    href: "/nextgen10",
    icon: GraduationCap,
    color: "from-green-500 to-green-600",
    badge: "Active",
  },
  {
    title: "Africa Climate Academy",
    description: "Building capacity for climate action and energy transition across the African continent.",
    href: "/climate-academy",
    icon: Globe,
    color: "from-teal-500 to-teal-600",
    badge: "New",
  },
  {
    title: "AFREIKH Summer School",
    description: "Intensive summer program on energy, infrastructure, and knowledge systems in Africa.",
    href: "/2025-afreikh-summer-school",
    icon: Award,
    color: "from-purple-500 to-purple-600",
    badge: "2025",
  },
  {
    title: "Resource Governance Hub",
    description: "A platform for knowledge exchange and collaboration on resource governance best practices.",
    href: "/rgchub",
    icon: Building,
    color: "from-orange-500 to-orange-600",
    badge: "Hub",
  },
  {
    title: "EICCG Fund",
    description: "Supporting innovative energy and infrastructure projects through strategic funding.",
    href: "/eiccg-fund",
    icon: DollarSign,
    color: "from-red-500 to-red-600",
    badge: "Fund",
  },
];

export function ProgramsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-acep-secondary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-acep-primary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-acepCard bg-gradient-to-br from-acep-secondary to-acep-primary mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Our Programs
          </h2>
          <p className="text-base text-slate-600 max-w-3xl mx-auto mb-6">
            Explore our diverse range of programs, events, and knowledge platforms driving energy governance excellence
          </p>
          <Link href="/programs">
            <Button 
              className="bg-gradient-to-r from-acep-primary to-acep-secondary hover:shadow-lg hover:shadow-acep-secondary/25"
            >
              View All Programs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {programItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.title}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-acep-primary/20 h-full flex flex-col relative overflow-hidden bg-white"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-5 rounded-bl-full`}></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-acepBtn bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    {item.badge && (
                      <span className="text-xs font-semibold text-white bg-gradient-to-r from-acep-secondary to-acep-primary px-3 py-1 rounded-acepBtn shadow-md">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg sm:text-xl group-hover:text-acep-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col relative z-10">
                  <CardDescription className="text-sm mb-6 flex-1">
                    {item.description}
                  </CardDescription>
                  <Link href={item.href}>
                    <Button 
                      variant="ghost" 
                      className="w-full group-hover:bg-acep-primary/10 group-hover:text-acep-primary transition-colors"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
