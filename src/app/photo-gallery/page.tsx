import { notFound } from "next/navigation";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml } from "@/lib/acep-snapshots";
import { extractPhotoGalleryItems, extractPrimaryHeading } from "@/lib/acep-media-extract";

export const dynamic = "force-dynamic";

export default async function PhotoGalleryPage() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/photo-gallery/");
  if (!entry || entry.status !== 200 || !entry.savedAs) notFound();

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const title = extractPrimaryHeading(html) || "Photo Gallery";
  const items = extractPhotoGalleryItems(html);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((it) => (
                <a
                  key={it.imageSrc}
                  href={it.href || "#"}
                  target={it.href?.startsWith("http") ? "_blank" : undefined}
                  rel={it.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group block overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.imageSrc}
                    alt=""
                    className="h-full w-full object-cover aspect-square group-hover:scale-[1.02] transition-transform"
                    loading="lazy"
                  />
                </a>
              ))}
              {items.length === 0 && <div className="text-sm text-slate-600" />}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-slate-200 p-5">
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

