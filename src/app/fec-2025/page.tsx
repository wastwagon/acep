import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml } from "@/lib/acep-snapshots";
import { extractPageIntro } from "@/lib/acep-page-extract";
import { extractDownloadLinks, extractYouTubeEmbedsFromHtml } from "@/lib/acep-links-extract";

export const dynamic = "force-dynamic";

export default async function Fec2025Page() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/fec-2025/");
  if (!entry || entry.status !== 200 || !entry.savedAs) notFound();

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const { title, intro, heroImage } = extractPageIntro(html);
  const downloads = extractDownloadLinks(html);
  const videos = extractYouTubeEmbedsFromHtml(html).slice(0, 12);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            {title || "Future of Energy Conference"}
          </h1>
          {intro && <p className="mt-3 text-base text-slate-600">{intro}</p>}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/").replace("http://acep.africa/wp-content/", "/acep-assets/wp-content/")}
                alt=""
                className="w-full rounded-2xl border border-slate-200 bg-slate-50"
              />
            )}

            {downloads.length > 0 && (
              <div className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {downloads.slice(0, 6).map((d) => (
                    <a
                      key={d.href}
                      href={d.href}
                      target={d.href.startsWith("http") ? "_blank" : undefined}
                      rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-acep-primary/30 hover:bg-slate-50 transition"
                    >
                      {d.text || "Download"}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {videos.map((src) => (
                  <div key={src} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div className="aspect-video bg-black">
                      <iframe
                        className="h-full w-full"
                        src={src}
                        title="Video"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="text-sm font-semibold text-slate-900 mb-3">FEC</div>
                <div className="space-y-2 text-sm">
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/fec-brochure">
                    Brochure
                  </Link>
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/fec-resource-centre">
                    Reports
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

