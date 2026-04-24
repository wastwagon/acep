import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Newspaper } from "lucide-react";
import { getPublications } from "@/lib/data/posts";
import { getNewsBlogPosts } from "@/lib/data/posts";
import { acepUrlToSlug } from "@/lib/utils/url-helpers";

export async function ContentShowcase() {
  const publications = await getPublications();
  const newsPosts = await getNewsBlogPosts();
  
  // Get latest items
  const latestPub = publications.filter(p => p.url && !p.url.includes('/category/') && !p.url.includes('/archives/')).slice(0, 1)[0];
  const latestNews = newsPosts.filter(n => n.url && !n.url.includes('/category/') && !n.url.includes('/archives/')).slice(0, 1)[0];

  // Fallback
  const featuredPub = latestPub || {
    title: "The Debt-Development Trade-Off: Assessing the Impact of Chinese Lending Strategy on Ghana's Sustainability Debt",
    excerpt: "Ghana's reliance on external financing has surged over the past decade, with its external debt stock increasing by 117% between...",
    url: "https://acep.africa/the-debt-development-trade-off-assessing-the-impact-of-chinese-lending-strategy-on-ghanas-sustainability-debt/",
    featuredImage: "https://acep.africa/wp-content/uploads/2026/01/Feature-Image-The-Debt–Development-Trade-off-Chinese-Lending-Strategy.jpeg",
  };

  const featuredNews = latestNews || {
    title: "Policy Note: Withdrawal of the Ghana–Barari DV Lithium Agreement",
    excerpt: "Following sustained public commentary, the lithium mining agreement between the Government...",
    url: "https://acep.africa/policy-note-withdrawal-of-the-ghana-barari-dv-lithium-agreement/",
    featuredImage: "https://acep.africa/wp-content/uploads/2025/12/Policy-Note-Ghana-Barari-Lithium-Agreement-Benjamin-Boakye.jpg",
  };

  const pubSlug = featuredPub.url ? acepUrlToSlug(featuredPub.url) : [];
  const newsSlug = featuredNews.url ? acepUrlToSlug(featuredNews.url) : [];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Latest Insights
          </h2>
          <p className="text-base text-slate-600 max-w-3xl mx-auto">
            Stay informed with our latest research, analysis, and commentary on energy governance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Featured Publication */}
          <div className="group">
            <Link href={featuredPub.url && featuredPub.url !== "#" ? `/publications/${pubSlug.join("/")}` : "#"}>
              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-slate-100">
                {featuredPub.featuredImage && (
                  <img
                    src={featuredPub.featuredImage.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/")}
                    alt={featuredPub.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-acep-secondary" />
                    <span className="text-sm font-semibold text-acep-secondary uppercase tracking-wide">Latest Research</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-acep-secondary transition-colors">
                    {featuredPub.title}
                  </h3>
                  <p className="text-slate-200 text-sm mb-4 line-clamp-2">
                    {featuredPub.excerpt || "Read our latest research and policy analysis..."}
                  </p>
                  <div className="flex items-center text-white font-medium group-hover:text-acep-secondary transition-colors">
                    Read Publication
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Featured News */}
          <div className="group">
            <Link href={featuredNews.url && featuredNews.url !== "#" ? `/publications/${newsSlug.join("/")}` : "#"}>
              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-slate-100">
                {featuredNews.featuredImage && (
                  <img
                    src={featuredNews.featuredImage.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/")}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Newspaper className="h-5 w-5 text-acep-secondary" />
                    <span className="text-sm font-semibold text-acep-secondary uppercase tracking-wide">Latest News</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-acep-secondary transition-colors">
                    {featuredNews.title}
                  </h3>
                  <p className="text-slate-200 text-sm mb-4 line-clamp-2">
                    {featuredNews.excerpt || "Stay updated with the latest developments..."}
                  </p>
                  <div className="flex items-center text-white font-medium group-hover:text-acep-secondary transition-colors">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/research-and-policy-papers">
            <Button className="bg-gradient-to-r from-acep-primary to-acep-secondary hover:shadow-lg w-full sm:w-auto">
              View All Publications
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/news-blog-posts">
            <Button variant="outline" className="border-acep-primary text-acep-primary hover:bg-acep-primary hover:text-white w-full sm:w-auto">
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
