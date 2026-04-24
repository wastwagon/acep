import Link from "next/link";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import { getNewsBlogPosts, getPressStatements } from "@/lib/data/posts";
import { acepUrlToSlug } from "@/lib/utils/url-helpers";
import { getMainCategory } from "@/lib/data/categories";

export async function NewsSection() {
  const newsPosts = await getNewsBlogPosts();
  const pressStatements = await getPressStatements(); // Get press statements from parent pages
  
  // Filter out invalid entries (archive pages, category pages, etc.)
  const validNews = newsPosts.filter((item) => {
    // Exclude archive/category pages and listing pages
    if (item.url) {
      const url = item.url.toLowerCase();
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
    if (item.category && item.category.length > 100) {
      return false;
    }
    // Exclude entries without proper title or with generic titles
    if (!item.title || item.title.length < 5 || 
        item.title.toLowerCase().includes('page not found') ||
        item.title.toLowerCase() === 'blog' ||
        item.title.toLowerCase() === 'newsletter' ||
        item.title.toLowerCase() === 'blogs & news' ||
        item.title.toLowerCase() === 'news & blog posts') {
      return false;
    }
    // Exclude entries with extremely long excerpts (likely malformed)
    if (item.excerpt && item.excerpt.length > 500) {
      return false;
    }
    return true;
  });

  // Filter press statements similarly
  const validPressStatements = pressStatements.filter((item) => {
    if (item.url) {
      const url = item.url.toLowerCase();
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
    if (item.category && item.category.length > 100) {
      return false;
    }
    if (!item.title || item.title.length < 5 || 
        item.title.toLowerCase().includes('page not found') ||
        item.title.toLowerCase() === 'blog' ||
        item.title.toLowerCase() === 'newsletter' ||
        item.title.toLowerCase() === 'blogs & news' ||
        item.title.toLowerCase() === 'news & blog posts') {
      return false;
    }
    if (item.excerpt && item.excerpt.length > 500) {
      return false;
    }
    return true;
  });

  // Combine news and press statements, then take the latest 4
  const combinedContent = [...validNews, ...validPressStatements]
    .sort((a, b) => {
      // Sort by date if available, otherwise keep original order
      if (a.dateText && b.dateText) {
        return new Date(b.dateText).getTime() - new Date(a.dateText).getTime();
      }
      return 0;
    });
  
  const latestNews = combinedContent.slice(0, 4);

  // Fallback data matching the live website - use when we have fewer than 4 valid news items
  // These match the news items shown on https://acep.africa/
  const fallbackNews = [
    {
      title: "Policy Note: Withdrawal of the Ghana–Barari DV Lithium Agreement",
      dateText: "December 15, 2025",
      category: "Press Statement",
      excerpt: "Following sustained public commentary, the lithium mining agreement between the Government...",
      url: "https://acep.africa/policy-note-withdrawal-of-the-ghana-barari-dv-lithium-agreement/",
      featuredImage: "https://acep.africa/wp-content/uploads/2025/12/Policy-Note-Ghana-Barari-Lithium-Agreement-Benjamin-Boakye.jpg",
    },
    {
      title: "ACEP's Analysis of the 2026 Budget and Economic Policy of Ghana",
      dateText: "November 20, 2025",
      category: "Analysis",
      excerpt: "The 2026 Budget and Economic Policy, presented to Parliament on November 13, 2025, outlines the government's fiscal outlook and...",
      url: "https://acep.africa/aceps-analysis-of-the-2026-budget-and-economic-policy-of-ghana/",
      featuredImage: "https://acep.africa/wp-content/uploads/2025/11/feature-image.jpg",
    },
    {
      title: "The Energy Mission",
      dateText: "November 9, 2025",
      category: "Blog Post",
      excerpt: "In this post, Ben Boakye reflects on insights from the AGORA Conference, stressing the need for Africa's energy future to...",
      url: "https://acep.africa/the-energy-mission/",
      featuredImage: "https://acep.africa/wp-content/uploads/2025/11/Benjamin-Boakye-ACEP-AGORA2025.png",
    },
    {
      title: "ACEP Statement on Energy Sector Reforms",
      dateText: "October 28, 2025",
      category: "Press Statement",
      excerpt: "ACEP calls for urgent reforms in Ghana's energy sector to address sustainability challenges and improve governance...",
      url: "https://acep.africa/acep-statement-on-energy-sector-reforms/",
      featuredImage: "https://acep.africa/wp-content/uploads/2025/10/energy-reforms.jpg",
    },
  ];

  // Use fallback if we have fewer than 4 valid news items
  const displayNews = latestNews.length >= 4 ? latestNews : fallbackNews;
  return (
    <section className="section-shell border-b border-slate-200 bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Media & Commentary</p>
            <h2
              className="font-display text-3xl font-medium tracking-[-0.02em] text-slate-900 md:text-[2.15rem]"
            >
              News & Updates
            </h2>
          </div>
          <Link
            href="/news-blog-posts"
            className="institutional-link"
          >
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayNews.map((item, index) => {
            const slug = item.url ? acepUrlToSlug(item.url) : [];
            const href = item.url && item.url !== "#" ? `/publications/${slug.join("/")}` : "#";
            const featuredImage = "featuredImage" in item ? item.featuredImage : undefined;
            return (
              <Link key={index} href={href} className="group">
                <div className="flex h-full flex-col overflow-hidden institutional-card institutional-card-hover">
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    {featuredImage ? (
                      <>
                        <img
                          src={featuredImage.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/")}
                          alt={item.title}
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
                        {getMainCategory("category" in item ? item.category : undefined, item.title, item.url).substring(0, 30)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    {item.dateText && (
                      <div className="mb-2.5 flex items-center text-xs text-slate-500">
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        <span>{item.dateText}</span>
                      </div>
                    )}

                    <h3 className="mb-2 line-clamp-3 text-base font-semibold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-acep-primary">
                      {item.title}
                    </h3>

                    {item.excerpt && (
                      <p className="mb-3 flex-1 line-clamp-2 text-sm text-slate-600">
                        {item.excerpt}
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
