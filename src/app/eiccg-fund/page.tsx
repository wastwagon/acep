import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml } from "@/lib/acep-snapshots";
import { extractPageIntro } from "@/lib/acep-page-extract";
import { extractDownloadLinks, extractTextLinks } from "@/lib/acep-links-extract";
import { acepHrefToLocalPath } from "@/lib/acep-extract";

export const dynamic = "force-dynamic";

export default async function EiccgFundPage() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/eiccg-fund/");
  if (!entry || entry.status !== 200 || !entry.savedAs) notFound();

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const { title, intro, heroImage } = extractPageIntro(html);

  const downloads = extractDownloadLinks(html);
  const links = extractTextLinks(html);

  const apply = links.find((l) => (l.text || "").toLowerCase() === "apply here");

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{title || "EICCG Fund"}</h1>
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
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {apply?.href && (
                <div className="rounded-xl border border-slate-200 p-5">
                  <div className="text-sm font-semibold text-slate-900 mb-3">{apply.text}</div>
                  <a
                    href={apply.href.startsWith("http") ? apply.href : acepHrefToLocalPath(apply.href)}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-acep-primary px-4 py-3 text-sm font-semibold text-white hover:bg-acep-primary/90 transition"
                    target={apply.href.startsWith("http") ? "_blank" : undefined}
                    rel={apply.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {apply.text}
                  </a>
                </div>
              )}

              <div className="rounded-xl border border-slate-200 p-5">
                <div className="text-sm font-semibold text-slate-900 mb-3">Programs</div>
                <div className="space-y-2 text-sm">
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/programs">
                    Events/Knowledge Platforms
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

