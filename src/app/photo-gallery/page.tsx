import type { Metadata } from "next";
import { resolvePhotoGalleryPage } from "@/lib/resolve-marketing-content";
import { GALLERY_LISTING_SEO } from "@/lib/marketing-builtin";
import { localWpImage } from "@/lib/resolve-marketing-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: GALLERY_LISTING_SEO.title,
  description: GALLERY_LISTING_SEO.description,
};

export default async function PhotoGalleryPage() {
  const { title, items } = await resolvePhotoGalleryPage();

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((it, i) => {
                const src = (it.imageSrc || "").replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/");
                return (
                  <a
                    key={it.imageSrc + String(i)}
                    href={it.href || "#"}
                    target={it.href?.startsWith("http") ? "_blank" : undefined}
                    rel={it.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group block overflow-hidden rounded-acepCard border border-slate-200 bg-slate-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={localWpImage(src) || src}
                      alt=""
                      className="h-full w-full object-cover aspect-square group-hover:scale-[1.02] transition-transform"
                      loading="lazy"
                    />
                  </a>
                );
              })}
            </div>
            <p className="mt-6 text-sm text-slate-500">Placeholder tiles use local SVGs; replace with real photography in the CMS (Media) when ready.</p>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-acepCard border border-slate-200 p-5">
                <div className="text-sm font-semibold text-slate-900 mb-3">Gallery</div>
                <div className="space-y-2 text-sm">
                  <a className="block text-slate-700 hover:text-acep-primary" href="/video-gallery">
                    Video Gallery
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
