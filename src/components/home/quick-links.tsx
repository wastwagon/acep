import Link from "next/link";
import { FileText, Newspaper, Briefcase, Mail } from "lucide-react";
const quickLinks = [
  {
    icon: FileText,
    title: "Resource Centre",
    href: "/resource-centre",
    description: "Access all publications and resources",
  },
  {
    icon: Newspaper,
    title: "Our Publications",
    href: "/research-and-policy-papers",
    description: "Research papers and policy briefs",
  },
  {
    icon: Newspaper,
    title: "Press Statements",
    href: "/press-statements",
    description: "Latest press releases",
  },
  {
    icon: Briefcase,
    title: "Work With Us",
    href: "/about-us",
    description: "Career opportunities",
  },
  {
    icon: Newspaper,
    title: "News & Blog",
    href: "/news-blog-posts",
    description: "Latest news and updates",
  },
  {
    icon: Mail,
    title: "Contact Us",
    href: "/about-us",
    description: "Get in touch with us",
  },
];

export function QuickLinks() {
  return (
    <section className="section-shell bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:mb-12">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Navigation Hub</p>
          <h2 className="font-display mb-4 text-3xl font-medium tracking-[-0.02em] text-slate-900 md:text-[2.15rem]">
            Quick Links
          </h2>
          <p className="section-description mx-auto max-w-2xl">
            Quick access to key sections of our website
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={index}
                href={link.href}
                className="group institutional-card institutional-card-hover p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="institutional-icon-box group-hover:border-acep-primary/20 group-hover:bg-acep-primary/5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-base font-semibold text-slate-900 transition-colors group-hover:text-acep-primary sm:text-lg">
                      {link.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
