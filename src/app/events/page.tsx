import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml, transformAcepHtmlForLocalAssets } from "@/lib/acep-snapshots";
import { acepHrefToLocalPath, extractListingItems } from "@/lib/acep-extract";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/events/");
  if (!entry || entry.status !== 200 || !entry.savedAs) notFound();

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const transformed = transformAcepHtmlForLocalAssets(html, { extractBody: true });
  const items = extractListingItems(html);

  const titleMatch = transformed.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const pageTitle = titleMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || "Events";

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{pageTitle}</h1>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {items.slice(0, 50).map((it) => (
                <article key={it.href} className="py-6">
                  <div className="flex gap-4">
                    {it.imageSrc && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.imageSrc.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/")}
                        alt=""
                        className="hidden sm:block h-24 w-36 object-cover rounded-md border border-slate-200 bg-slate-50"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      {it.dateText && <div className="text-xs text-slate-500 mb-1">{it.dateText}</div>}
                      <h2 className="text-lg font-semibold text-slate-900 hover:text-acep-primary transition-colors">
                        <Link href={acepHrefToLocalPath(it.href)}>{it.title}</Link>
                      </h2>
                      {it.excerpt && <p className="mt-2 text-sm text-slate-600 line-clamp-3">{it.excerpt}</p>}
                      <div className="mt-3">
                        <Link
                          href={acepHrefToLocalPath(it.href)}
                          className="text-sm font-semibold text-acep-primary hover:underline"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              {items.length === 0 && <div className="py-10 text-sm text-slate-600" />}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="text-sm font-semibold text-slate-900 mb-3">Programs</div>
                <div className="space-y-2 text-sm">
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/programs">
                    Events/Knowledge Platforms
                  </Link>
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/nextgen10">
                    NextGen Leaders Program
                  </Link>
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/climate-academy">
                    Africa Climate Academy
                  </Link>
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/2025-afreikh-summer-school">
                    AFREIKH Summer School
                  </Link>
                  <Link className="block text-slate-700 hover:text-acep-primary" href="/rgchub-campuses">
                    Resource Governance Campus Hub
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
