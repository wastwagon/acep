import { Hero } from "@/components/home/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { MediaSpotlight } from "@/components/home/media-spotlight";
import { VisionSection } from "@/components/home/vision-section";
import { MissionSection } from "@/components/home/mission-section";
import { MenuSummaries } from "@/components/home/menu-summaries";
import { PlatformCards } from "@/components/home/platform-cards";
import { LatestPublications } from "@/components/home/latest-publications";
import { NewsSection } from "@/components/home/news-section";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { PhotoGalleryPreview } from "@/components/home/photo-gallery-preview";
import { QuickLinks } from "@/components/home/quick-links";

export default async function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner Section */}
      <Hero />

      {/* Media-forward spotlight (template-inspired) */}
      <MediaSpotlight />
      
      {/* Vision Section - WE ENVISION with Introduction */}
      <VisionSection />
      
      {/* Mission & Focus Areas Section */}
      <MissionSection />
      
      {/* Menu Summaries - All Main Menu Items */}
      <MenuSummaries />
      
      {/* Platform Cards - Main Navigation to Sub-platforms */}
      <section className="bg-white py-14 md:py-18 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            className="mb-8 md:mb-12"
            eyebrow="Monitoring systems"
            title="Data platforms"
            description="Access comprehensive data and insights across Ghana&apos;s energy sector through our specialized monitoring platforms."
          />
          <PlatformCards />
        </div>
      </section>
      
      {/* Latest Publications */}
      <LatestPublications />
      
      {/* News & Blog Posts */}
      <NewsSection />
      
      {/* Upcoming Events */}
      <UpcomingEvents />
      
      {/* Photo Gallery Preview */}
      <PhotoGalleryPreview />
      
      {/* Quick Links */}
      <QuickLinks />
    </div>
  );
}
