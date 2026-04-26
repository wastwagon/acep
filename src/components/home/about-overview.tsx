import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Users, Handshake, Award, ArrowRight } from "lucide-react";

const aboutLinks = [
  { name: "The Organisation", href: "/the-organisation", icon: Building2 },
  { name: "Our Team", href: "/team", icon: Users },
  { name: "Our Partners", href: "/our-partners", icon: Handshake },
  { name: "Governing Board", href: "/governing-board", icon: Award },
];

export function AboutOverview() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              About ACEP
            </h2>
            <p className="text-base text-slate-600 mb-8 max-w-2xl mx-auto">
              Learn about our mission, leadership, dedicated team, and the partners who support our work in promoting transparency and accountability in energy governance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {aboutLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group p-6 text-center rounded-acepCard bg-white border-2 border-slate-100 hover:border-acep-primary hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-acepBtn bg-gradient-to-br from-acep-primary to-acep-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-acep-primary transition-colors">
                    {link.name}
                  </h3>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/about-us">
              <Button variant="outline" className="border-acep-primary text-acep-primary hover:bg-acep-primary hover:text-white">
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
