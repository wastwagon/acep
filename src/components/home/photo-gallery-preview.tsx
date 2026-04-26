import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Image as ImageIcon } from "lucide-react";

/** Local ACEP media (same library as homepage / mega menus). */
const galleryImages = [
  { src: "/acep-assets/wp-content/uploads/2024/06/Public-Forum.jpg", alt: "ACEP public forum" },
  { src: "/acep-assets/wp-content/uploads/2024/09/oil-pump.jpg", alt: "Energy sector context" },
  { src: "/acep-assets/wp-content/uploads/2025/12/FEC-2025-feature-image.png", alt: "Future of Energy Conference" },
  { src: "/acep-assets/wp-content/uploads/2024/05/2024-Sumer-School-Feature-Img-1.jpg", alt: "NextGen summer school" },
  { src: "/acep-assets/wp-content/uploads/2024/06/Public-Forum.jpg", alt: "Community dialogue" },
  { src: "/acep-assets/wp-content/uploads/2024/09/oil-pump.jpg", alt: "Field and infrastructure" },
  { src: "/acep-assets/wp-content/uploads/2025/12/FEC-2025-feature-image.png", alt: "Conference programme" },
  { src: "/acep-assets/wp-content/uploads/2024/05/2024-Sumer-School-Feature-Img-1.jpg", alt: "Youth programme" },
];

export function PhotoGalleryPreview() {
  return (
    <section className="section-shell border-b border-slate-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center md:mb-12">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Field Activities</p>
            <h2 className="font-display mb-2 text-3xl font-medium tracking-[-0.02em] text-slate-900 md:text-[2.15rem]">
              Photo Gallery
            </h2>
            <p className="text-sm text-slate-600">Moments from our events, conferences, and activities</p>
          </div>
          <Link href="/photo-gallery" className="institutional-link">
            View all photos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {galleryImages.map((image, index) => (
            <Link
              key={`${image.src}-${index}`}
              href="/photo-gallery"
              aria-label={`Open photo gallery: ${image.alt}`}
              className="group relative aspect-square overflow-hidden rounded-acepCard border border-slate-200/90 bg-slate-100 shadow-sm ring-1 ring-slate-950/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:border-acep-primary/25 hover:shadow-md"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.05]"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 z-10 bg-slate-900/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ImageIcon className="h-8 w-8 text-white" aria-hidden />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
