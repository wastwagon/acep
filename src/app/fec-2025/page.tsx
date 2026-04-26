import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { resolveFec2025Page } from "@/lib/resolve-marketing-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const r = await resolveFec2025Page();
  if (!r) return { title: "ACEP" };
  return { title: r.seoTitle, description: r.seoDescription };
}

export default async function Fec2025Page() {
  const r = await resolveFec2025Page();
  if (!r) notFound();

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{r.title}</h1>
          {r.intro && <p className="mt-3 text-base text-slate-600">{r.intro}</p>}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {r.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={r.heroImage}
                alt=""
                className="w-full rounded-acepCard border border-slate-200 bg-slate-50"
              />
            )}

            <div className="mt-8 rounded-acepCard border border-slate-200 bg-white p-6">
              <div
                className="acep-rich prose prose-slate max-w-none prose-a:text-acep-primary"
                dangerouslySetInnerHTML={{ __html: r.contentHtml }}
              />
            </div>

            {r.downloads.length > 0 && (
              <div className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {r.downloads.slice(0, 6).map((d) => (
                    <a
                      key={d.href}
                      href={d.href}
                      target={d.href.startsWith("http") ? "_blank" : undefined}
                      rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center justify-center rounded-acepBtn border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-acep-primary/30 hover:bg-slate-50 transition"
                    >
                      {d.text || "Download"}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {r.videos.length > 0 && (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {r.videos.map((src) => (
                  <div key={src} className="rounded-acepCard border border-slate-200 bg-white overflow-hidden">
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
              <div className="rounded-acepCard border border-slate-200 p-5">
                <div className="text-sm font-semibold text-slate-900 mb-3">FEC & events</div>
                <div className="space-y-2 text-sm">
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/future-of-energy-conference">
                    Future of Energy Conference
                  </Link>
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/fec-brochure">
                    Brochure
                  </Link>
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/fec-resource-centre">
                    Resource centre
                  </Link>
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/e">
                    Event registration
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
