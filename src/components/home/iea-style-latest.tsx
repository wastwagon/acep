import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Newspaper } from "lucide-react";
import { getPublications } from "@/lib/data/posts";
import { getNewsBlogPosts } from "@/lib/data/posts";
import { acepUrlToSlug } from "@/lib/utils/url-helpers";

export async function IEALatest() {
  const publications = await getPublications();
  const newsPosts = await getNewsBlogPosts();
  
  // Get latest items
  const latestPubs = publications
    .filter(p => p.url && !p.url.includes('/category/') && !p.url.includes('/archives/'))
    .slice(0, 4);
  const latestNews = newsPosts
    .filter(n => n.url && !n.url.includes('/category/') && !n.url.includes('/archives/'))
    .slice(0, 4);

  // Fallback data
  const fallbackPubs = [
    {
      title: "The Debt-Development Trade-Off: Assessing the Impact of Chinese Lending Strategy on Ghana's Sustainability Debt",
      category: "Research & Policy Papers",
      url: "https://acep.africa/the-debt-development-trade-off-assessing-the-impact-of-chinese-lending-strategy-on-ghanas-sustainability-debt/",
      featuredImage: "https://acep.africa/wp-content/uploads/2026/01/Feature-Image-The-Debt–Development-Trade-off-Chinese-Lending-Strategy.jpeg",
    },
    {
      title: "2025 Future of Energy Conference Report",
      category: "Reports",
      url: "https://acep.africa/2025-future-of-energy-conference-report/",
      featuredImage: "https://acep.africa/wp-content/uploads/2025/12/FEC-2025-feature-image.png",
    },
    {
      title: "The Debt Tracker (Issue 2)",
      category: "Policy Brief",
      url: "https://acep.africa/the-debt-tracker-issue-2/",
      featuredImage: "https://acep.africa/wp-content/uploads/2025/06/Government-of-Ghana-Debt-Tracker-ACEP-.png",
    },
  ];

  const fallbackNews = [
    {
      title: "Policy Note: Withdrawal of the Ghana–Barari DV Lithium Agreement",
      category: "Press Statement",
      url: "https://acep.africa/policy-note-withdrawal-of-the-ghana-barari-dv-lithium-agreement/",
      featuredImage: "https://acep.africa/wp-content/uploads/2025/12/Policy-Note-Ghana-Barari-Lithium-Agreement-Benjamin-Boakye.jpg",
    },
    {
      title: "ACEP's Analysis of the 2026 Budget and Economic Policy of Ghana",
      category: "Analysis",
      url: "https://acep.africa/aceps-analysis-of-the-2026-budget-and-economic-policy-of-ghana/",
      featuredImage: "https://acep.africa/wp-content/uploads/2025/11/feature-image.jpg",
    },
    {
      title: "The Energy Mission",
      category: "Blog Post",
      url: "https://acep.africa/the-energy-mission/",
      featuredImage: "https://acep.africa/wp-content/uploads/2025/11/Benjamin-Boakye-ACEP-AGORA2025.png",
    },
  ];

  const displayPubs = latestPubs.length >= 3 ? latestPubs : fallbackPubs;
  const displayNews = latestNews.length >= 3 ? latestNews : fallbackNews;

  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Latest news, commentaries and reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Featured Publication */}
          {displayPubs[0] && (() => {
            const pub = displayPubs[0];
            const slug = pub.url ? acepUrlToSlug(pub.url) : [];
            return (
              <Link href={pub.url && pub.url !== "#" ? `/publications/${slug.join("/")}` : "#"} className="group">
                <div className="relative h-64 overflow-hidden rounded-acepCard bg-slate-100 mb-3">
                  {pub.featuredImage && (
                    <img
                      src={pub.featuredImage.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/")}
                      alt={pub.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="text-sm font-semibold text-acep-primary mb-1 uppercase tracking-wide">
                  {pub.category || "Research & Policy Papers"}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-acep-primary transition-colors line-clamp-2">
                  {pub.title}
                </h3>
              </Link>
            );
          })()}

          {/* Other Publications and News */}
          {[...displayPubs.slice(1, 2), ...displayNews.slice(0, 2)].map((item, index) => {
            const slug = item.url ? acepUrlToSlug(item.url) : [];
            const isNews = index >= 1;
            return (
              <Link key={index} href={item.url && item.url !== "#" ? `/publications/${slug.join("/")}` : "#"} className="group">
                <div className="relative h-48 overflow-hidden rounded-acepCard bg-slate-100 mb-3">
                  {item.featuredImage && (
                    <img
                      src={item.featuredImage.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/")}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="text-sm font-semibold text-acep-primary mb-1 uppercase tracking-wide">
                  {item.category || (isNews ? "News" : "Publication")}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-acep-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
