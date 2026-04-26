import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Newspaper, BookOpen, BarChart3, Camera, Video, Radio, ArrowRight, Library } from "lucide-react";

const resourceItems = [
  {
    title: "Research & Policy Papers",
    description: "Access comprehensive research papers and policy analyses on energy governance, fiscal transparency, and resource management.",
    href: "/research-and-policy-papers",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    count: "100+",
  },
  {
    title: "Press Statements",
    description: "Read our official statements on critical energy policy issues, government decisions, and sector developments.",
    href: "/press-statements",
    icon: Newspaper,
    color: "from-red-500 to-red-600",
    count: "50+",
  },
  {
    title: "News & Blog Posts",
    description: "Stay updated with the latest news, insights, and expert commentary on Africa's energy sector.",
    href: "/news-blog-posts",
    icon: BookOpen,
    color: "from-green-500 to-green-600",
    count: "200+",
  },
  {
    title: "Annual Reports",
    description: "Review our annual reports detailing achievements, impact, and financial transparency.",
    href: "/annual-reports",
    icon: BarChart3,
    color: "from-purple-500 to-purple-600",
    count: "15+",
  },
  {
    title: "ACEP Radar",
    description: "Real-time monitoring and analysis of energy sector developments and policy changes.",
    href: "/radar",
    icon: Radio,
    color: "from-orange-500 to-orange-600",
    count: "Live",
  },
  {
    title: "Photo Gallery",
    description: "Browse photos from our events, conferences, workshops, and field activities.",
    href: "/photo-gallery",
    icon: Camera,
    color: "from-pink-500 to-pink-600",
    count: "500+",
  },
  {
    title: "Video Gallery",
    description: "Watch documentaries, interviews, conference recordings, and educational content.",
    href: "/video-gallery",
    icon: Video,
    color: "from-indigo-500 to-indigo-600",
    count: "100+",
  },
];

export function ResourceCentreSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-acepCard bg-gradient-to-br from-acep-primary to-acep-secondary mb-4">
            <Library className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Resource Centre
          </h2>
          <p className="text-base text-slate-600 max-w-3xl mx-auto mb-6">
            Access our comprehensive library of research, publications, media, and data resources
          </p>
          <Link href="/resource-centre">
            <Button 
              className="bg-gradient-to-r from-acep-primary to-acep-secondary hover:shadow-lg hover:shadow-acep-secondary/25"
            >
              Explore All Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {resourceItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.title}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-acep-primary/20 h-full flex flex-col relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-5 rounded-bl-full`}></div>
                <CardHeader className="relative z-10">
                  <div className={`w-12 h-12 rounded-acepBtn bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base sm:text-lg group-hover:text-acep-primary transition-colors flex-1">
                      {item.title}
                    </CardTitle>
                    {item.count && (
                      <span className="text-xs font-semibold text-acep-secondary bg-acep-secondary/10 px-2 py-1 rounded-acepBtn whitespace-nowrap">
                        {item.count}
                      </span>
                    )}
                  </div>
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
                      View Resources
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
