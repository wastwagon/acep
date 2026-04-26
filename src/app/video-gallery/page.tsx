import type { Metadata } from "next";
import Link from "next/link";
import { resolveVideoGalleryPage } from "@/lib/resolve-marketing-content";
import { VIDEO_GALLERY_SEO } from "@/lib/marketing-builtin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: VIDEO_GALLERY_SEO.title,
  description: VIDEO_GALLERY_SEO.description,
};

export default async function VideoGalleryPage() {
  const { title, items } = await resolveVideoGalleryPage();

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((it) => (
                  <div key={it.key} className="rounded-acepCard border border-slate-200 bg-white overflow-hidden">
                    <div className="aspect-video bg-black">
                      <iframe
                        className="h-full w-full"
                        src={it.src}
                        title={it.title || "Video"}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 max-w-2xl">
                No video embeds were found in the snapshot. Add your clips through the CMS, or see{" "}
                <Link className="font-semibold text-acep-primary hover:underline" href="/videos">OilMoneyTV (videos)</Link> for platform
                productions.
              </p>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-acepCard border border-slate-200 p-5">
                <div className="text-sm font-semibold text-slate-900 mb-3">Gallery</div>
                <div className="space-y-2 text-sm">
                  <a className="block text-slate-700 hover:text-acep-primary" href="/photo-gallery">
                    Photo Gallery
                  </a>
                  <a className="block text-slate-700 hover:text-acep-primary" href="/videos">
                    OilMoney TV
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
