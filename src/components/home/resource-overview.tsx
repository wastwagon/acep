import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Newspaper, BookOpen, BarChart3, Camera, Video, Radio, ArrowRight, Library } from "lucide-react";

const resources = [
  { name: "Research & Policy Papers", href: "/research-and-policy-papers", icon: FileText },
  { name: "Press Statements", href: "/press-statements", icon: Newspaper },
  { name: "News & Blog Posts", href: "/news-blog-posts", icon: BookOpen },
  { name: "Annual Reports", href: "/annual-reports", icon: BarChart3 },
  { name: "ACEP Radar", href: "/radar", icon: Radio },
  { name: "Photo Gallery", href: "/photo-gallery", icon: Camera },
  { name: "Video Gallery", href: "/video-gallery", icon: Video },
];

export function ResourceOverview() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-acepCard bg-gradient-to-br from-acep-primary to-acep-secondary mb-4">
            <Library className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Resource Centre
          </h2>
          <p className="text-base text-slate-600">
            Access our comprehensive library of research, publications, media, and data resources
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.name}
                href={resource.href}
                className="group p-4 text-center rounded-acepCard bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-acep-primary hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-acepBtn bg-gradient-to-br from-acep-primary to-acep-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xs font-semibold text-slate-900 group-hover:text-acep-primary transition-colors leading-tight">
                  {resource.name}
                </h3>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/resource-centre">
            <Button className="bg-gradient-to-r from-acep-primary to-acep-secondary hover:shadow-lg">
              Explore All Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
