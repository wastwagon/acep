import { VideosHero } from "@/components/videos/videos-hero";
import { VideosStats } from "@/components/videos/videos-stats";
import { VideosGrid } from "@/components/videos/videos-grid";

export default function VideosPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <VideosHero />
      
      {/* Stats Section */}
      <VideosStats />
      
      {/* Videos Grid */}
      <section className="py-12 md:py-16 lg:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
              Video Library
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Watch our mini documentaries as we cover how oil money in Ghana is distributed to ensure accountability
            </p>
          </div>
          <VideosGrid />
        </div>
      </section>
    </div>
  );
}
