import { notFound } from "next/navigation";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml } from "@/lib/acep-snapshots";
import { extractPageIntro } from "@/lib/acep-page-extract";
import { extractDownloadLinks } from "@/lib/acep-links-extract";

export const dynamic = "force-dynamic";

export default async function FecBrochurePage() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/fec-brochure/");
  if (!entry || entry.status !== 200 || !entry.savedAs) notFound();

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const { title, heroImage } = extractPageIntro(html);
  const downloads = extractDownloadLinks(html);
  const first = downloads[0];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{title || "Brochure"}</h1>
        </div>

        <div className="mt-8 max-w-3xl">
          {heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/").replace("http://acep.africa/wp-content/", "/acep-assets/wp-content/")}
              alt=""
              className="w-full rounded-2xl border border-slate-200 bg-slate-50"
            />
          )}

          {first && (
            <div className="mt-6">
              <a
                href={first.href}
                target={first.href.startsWith("http") ? "_blank" : undefined}
                rel={first.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-acep-primary/30 hover:bg-slate-50 transition"
              >
                {first.text || "Download Here"}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

