import Link from "next/link";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { getPublications, getReports } from "@/lib/data/posts";
import { acepUrlToSlug } from "@/lib/utils/url-helpers";
import { getMainCategory } from "@/lib/data/categories";

export async function LatestPublications() {
  const publications = await getPublications();
  const reports = await getReports(); // Get reports from parent pages
  
  // Filter out invalid entries (archive pages, category pages, etc.)
  const validPublications = publications.filter((pub) => {
    // Exclude archive/category pages and listing pages
    if (pub.url) {
      const url = pub.url.toLowerCase();
      if (url.includes('/category/') || 
          url.includes('/archives/') || 
          url.includes('/blog/') ||
          url.includes('/blogs-news/') ||
          url.includes('/news-blog-posts/') ||
          url.includes('/member/') ||
          url.includes('/newsletter') ||
          url === 'https://acep.africa/blogs-news/' ||
          url === 'https://acep.africa/news-blog-posts/') {
        return false;
      }
    }
    // Exclude entries with malformed category (too long = contains navigation HTML)
    if (pub.category && pub.category.length > 100) {
      return false;
    }
    // Exclude entries without proper title or with generic titles
    if (!pub.title || pub.title.length < 5 || 
        pub.title.toLowerCase().includes('page not found') ||
        pub.title.toLowerCase() === 'blog' ||
        pub.title.toLowerCase() === 'newsletter') {
      return false;
    }
    // Exclude entries with extremely long excerpts (likely malformed)
    if (pub.excerpt && pub.excerpt.length > 500) {
      return false;
    }
    return true;
  });

  // Filter reports similarly
  const validReports = reports.filter((report) => {
    if (report.url) {
      const url = report.url.toLowerCase();
      if (url.includes('/category/') || 
          url.includes('/archives/') || 
          url.includes('/blog/') ||
          url.includes('/blogs-news/') ||
          url.includes('/news-blog-posts/') ||
          url.includes('/member/') ||
          url.includes('/newsletter') ||
          url === 'https://acep.africa/blogs-news/' ||
          url === 'https://acep.africa/news-blog-posts/') {
        return false;
      }
    }
    if (report.category && report.category.length > 100) {
      return false;
    }
    if (!report.title || report.title.length < 5 || 
        report.title.toLowerCase().includes('page not found') ||
        report.title.toLowerCase() === 'blog' ||
        report.title.toLowerCase() === 'newsletter') {
      return false;
    }
    if (report.excerpt && report.excerpt.length > 500) {
      return false;
    }
    return true;
  });

  // Combine publications and reports, then take the latest 4
  const combinedContent = [...validPublications, ...validReports]
    .sort((a, b) => {
      // Sort by date if available, otherwise keep original order
      if (a.dateText && b.dateText) {
        return new Date(b.dateText).getTime() - new Date(a.dateText).getTime();
      }
      return 0;
    });
  
  const latestPublications = combinedContent.slice(0, 4);

  // Fallback data matching the live website - use when we have fewer than 3 valid publications
  // These match the publications shown on https://acep.africa/
  const fallbackPublications = [
    {
      title: "The Debt-Development Trade-Off: Assessing the Impact of Chinese Lending Strategy on Ghana's Sustainability Debt",
      dateText: "November 10, 2025",
      category: "Research & Policy Papers",
      excerpt: "Ghana's reliance on external financing has surged over the past decade, with its external debt stock increasing by 117% between...",
      url: "https://acep.africa/the-debt-development-trade-off-assessing-the-impact-of-chinese-lending-strategy-on-ghanas-sustainability-debt/",
      featuredImage: "https://acep.africa/wp-content/uploads/2026/01/Feature-Image-The-Debt–Development-Trade-off-Chinese-Lending-Strategy.jpeg",
    },
    {
      title: "2025 Future of Energy Conference Report",
      dateText: "September 22, 2025",
      category: "Reports",
      excerpt: "This report outlines key discussions and action points from FEC 2025 on financing energy access and Africa's economic transformation.",
      url: "https://acep.africa/2025-future-of-energy-conference-report/",
      featuredImage: "https://acep.africa/wp-content/uploads/2025/12/FEC-2025-feature-image.png",
    },
    {
      title: "The Debt Tracker (Issue 2)",
      dateText: "June 25, 2025",
      category: "Policy Brief",
      excerpt: "This debt tracker monitors the relationship between Ghana's debt sustainability and key fiscal governance decisions, with a particular focus on...",
      url: "https://acep.africa/the-debt-tracker-issue-2/",
      featuredImage: "https://acep.africa/wp-content/uploads/2025/06/Government-of-Ghana-Debt-Tracker-ACEP-.png",
    },
    {
      title: "Annual Report 2024",
      dateText: "March 15, 2025",
      category: "Reports",
      excerpt: "Comprehensive overview of ACEP's activities, achievements, and impact in 2024 across energy governance and policy advocacy.",
      url: "https://acep.africa/annual-report-2024/",
      featuredImage: "https://acep.africa/wp-content/uploads/2025/03/annual-report-2024.jpg",
    },
  ];

  // Use fallback if we have fewer than 4 valid publications
  const displayPublications = latestPublications.length >= 4 ? latestPublications : fallbackPublications;
  return (
    <section className="section-shell border-b border-slate-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Research Library</p>
            <h2
              className="font-display text-3xl font-medium tracking-[-0.02em] text-slate-900 md:text-[2.15rem]"
            >
              Latest Publications
            </h2>
          </div>
          <Link
            href="/research-and-policy-papers"
            className="institutional-link"
          >
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPublications.map((pub, index) => {
            const slug = pub.url ? acepUrlToSlug(pub.url) : [];
            const href = pub.url && pub.url !== "#" ? `/publications/${slug.join("/")}` : "#";
            const featuredImage = "featuredImage" in pub ? pub.featuredImage : undefined;
            return (
              <Link key={index} href={href} className="group">
                <div className="flex h-full flex-col overflow-hidden institutional-card institutional-card-hover">
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    {featuredImage ? (
                      <>
                        <img
                          src={featuredImage.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/")}
                          alt={pub.title}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100">
                        <FileText className="h-14 w-14 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                        {getMainCategory("category" in pub ? pub.category : undefined, pub.title, pub.url).substring(0, 30)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    {pub.dateText && (
                      <div className="mb-2.5 flex items-center text-xs text-slate-500">
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        <span>{pub.dateText}</span>
                      </div>
                    )}

                    <h3 className="mb-2 line-clamp-3 text-base font-semibold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-acep-primary">
                      {pub.title}
                    </h3>

                    {pub.excerpt && (
                      <p className="mb-3 flex-1 line-clamp-2 text-sm text-slate-600">
                        {pub.excerpt}
                      </p>
                    )}

                    <div className="mt-auto flex items-center border-t border-slate-100 pt-2 text-sm font-semibold text-acep-primary">
                      <span className="inline-flex items-center transition-transform duration-200 group-hover:translate-x-1">
                        Read more
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </span>
                    </div>
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
