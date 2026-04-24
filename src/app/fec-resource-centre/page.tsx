import { notFound } from "next/navigation";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml } from "@/lib/acep-snapshots";
import { extractPageIntro } from "@/lib/acep-page-extract";
import { extractDownloadLinks } from "@/lib/acep-links-extract";

export const dynamic = "force-dynamic";

export default async function FecResourceCentrePage() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/fec-resource-centre/");
  if (!entry || entry.status !== 200 || !entry.savedAs) notFound();

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const { title, intro, heroImage } = extractPageIntro(html);
  const downloads = extractDownloadLinks(html);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            {title || "FEC Resource Centre"}
          </h1>
          {intro && <p className="mt-3 text-base text-slate-600">{intro}</p>}
        </div>

        <div className="mt-8 max-w-4xl">
          {heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/").replace("http://acep.africa/wp-content/", "/acep-assets/wp-content/")}
              alt=""
              className="w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50"
            />
          )}

          {downloads.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {downloads.slice(0, 6).map((d) => (
                <a
                  key={d.href}
                  href={d.href}
                  target={d.href.startsWith("http") ? "_blank" : undefined}
                  rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-acep-primary/30 hover:bg-slate-50 transition"
                >
                  {d.text || "Read"}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

