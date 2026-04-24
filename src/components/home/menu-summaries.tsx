import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Library, Calendar, FileText, Newspaper, Zap } from "lucide-react";

/** Distinct crops from the same asset library (avoids one hero image everywhere). */
const menuItems = [
  {
    title: "About Us",
    href: "/about-us",
    description:
      "Learn about our mission, vision, leadership team, and the partners who support our work in promoting transparency and accountability in energy governance across Africa.",
    image: "/acep-assets/wp-content/uploads/2024/06/Public-Forum.jpg",
    icon: Users,
    subItems: ["The Organisation", "Governing Board", "Our Team", "Our Partners"],
  },
  {
    title: "Resource Centre",
    href: "/resource-centre",
    description:
      "Access our comprehensive library of research papers, policy briefs, press statements, annual reports, and multimedia resources including photo and video galleries.",
    image: "/acep-assets/wp-content/uploads/2024/09/oil-pump.jpg",
    icon: Library,
    subItems: [
      "Research & Policy Papers",
      "Press Statements",
      "News & Blog Posts",
      "Annual Reports",
      "ACEP Radar",
      "Photo Gallery",
      "Video Gallery",
    ],
  },
  {
    title: "Programs",
    href: "/programs",
    description:
      "Explore our diverse range of programs, events, and knowledge platforms including the Future of Energy Conference, NextGen Program, Africa Climate Academy, and more.",
    image: "/acep-assets/wp-content/uploads/2025/12/FEC-2025-feature-image.png",
    icon: Calendar,
    subItems: [
      "Future of Energy Conference",
      "NextGen Program",
      "Africa Climate Academy",
      "Resource Governance Hub",
    ],
  },
  {
    title: "Publications",
    href: "/research-and-policy-papers",
    description:
      "Browse our extensive collection of research papers, policy briefs, and reports on energy governance, fiscal transparency, and resource management in Africa.",
    image: "/acep-assets/wp-content/uploads/2024/05/2024-Sumer-School-Feature-Img-1.jpg",
    icon: FileText,
  },
  {
    title: "News",
    href: "/news-blog-posts",
    description:
      "Stay updated with the latest news, press statements, analysis, and expert commentary on Africa's energy sector and policy developments.",
    image: "/acep-assets/wp-content/uploads/2024/09/oil-pump.jpg",
    icon: Newspaper,
  },
  {
    title: "Events",
    href: "/events",
    description:
      "Discover upcoming conferences, workshops, seminars, and application opportunities including the Future of Energy Conference and other key events.",
    image: "/acep-assets/wp-content/uploads/2024/05/2024-Sumer-School-Feature-Img-1.jpg",
    icon: Calendar,
  },
  {
    title: "Platforms",
    href: "/platforms",
    description:
      "Access our specialized monitoring platforms including Contract Monitor, Electricity Monitor, Oil Revenue Tracker, OilMoneyTV, and OpenTax for comprehensive energy sector data.",
    image: "/acep-assets/wp-content/uploads/2024/09/oil-pump.jpg",
    icon: Zap,
    subItems: ["Contract Monitor", "Electricity Monitor", "Oil Revenue Tracker", "OilMoneyTV", "OpenTax"],
  },
];

export function MenuSummaries() {
  return (
    <section className="border-b border-slate-200 bg-white py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Site overview</p>
          <h2 className="font-display mb-4 text-3xl font-medium tracking-[-0.02em] text-slate-900 md:text-[2.15rem]">
            Explore ACEP
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600">
            Discover our key areas of work, resources, and platforms
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href} className="group block">
                <div className="relative mb-4 h-48 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-950/[0.04]">
                  <Image
                    src={item.image}
                    alt={`${item.title} — preview`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-80 transition group-hover:opacity-95" />
                  <div className="absolute left-4 top-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 text-acep-primary shadow-sm backdrop-blur-sm transition group-hover:bg-acep-primary group-hover:text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-acep-primary">
                  {item.title}
                </h3>
                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
                {item.subItems && item.subItems.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {item.subItems.slice(0, 3).map((subItem, index) => (
                      <span key={index} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {subItem}
                      </span>
                    ))}
                    {item.subItems.length > 3 && (
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        +{item.subItems.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center text-sm font-semibold text-acep-primary transition-transform group-hover:translate-x-1">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
