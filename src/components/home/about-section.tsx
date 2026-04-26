import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Handshake, Award, ArrowRight } from "lucide-react";

const aboutItems = [
  {
    title: "The Organisation",
    description: "Learn about our mission, vision, and commitment to promoting transparency in energy governance across Africa.",
    href: "/the-organisation",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Governing Board",
    description: "Meet the distinguished leaders guiding ACEP's strategic direction and governance.",
    href: "/governing-board",
    icon: Award,
    color: "from-acep-secondary to-orange-600",
  },
  {
    title: "Our Team",
    description: "Get to know the experts, researchers, and advocates driving change in energy policy.",
    href: "/team",
    icon: Users,
    color: "from-acep-primary to-blue-700",
  },
  {
    title: "Our Partners",
    description: "Discover the organizations and institutions collaborating with us to advance energy governance.",
    href: "/our-partners",
    icon: Handshake,
    color: "from-green-500 to-green-600",
  },
];

export function AboutSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            About Us
          </h2>
          <p className="text-base text-slate-600 max-w-3xl mx-auto mb-6">
            Discover who we are, our leadership, dedicated team, and the partners who support our mission
          </p>
          <Link href="/about-us">
            <Button 
              variant="outline" 
              className="border-acep-primary text-acep-primary hover:bg-acep-primary hover:text-white"
            >
              Learn More About ACEP
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {aboutItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.title}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-acep-primary/20 h-full flex flex-col"
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-acepBtn bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl group-hover:text-acep-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="text-sm mb-6 flex-1">
                    {item.description}
                  </CardDescription>
                  <Link href={item.href}>
                    <Button 
                      variant="ghost" 
                      className="w-full group-hover:bg-acep-primary/10 group-hover:text-acep-primary transition-colors"
                    >
                      Explore
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
