import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml } from "@/lib/acep-snapshots";
import { extractPageIntro } from "@/lib/acep-page-extract";
import { acepHrefToLocalPath, extractListingItems } from "@/lib/acep-extract";

export const dynamic = "force-dynamic";

const sections = [
  { title: "Research & Policy Papers", href: "/research-and-policy-papers" },
  { title: "Press Statements", href: "/press-statements" },
  { title: "News & Blog Posts", href: "/news-blog-posts" },
  { title: "ACEP Radar", href: "/radar" },
  { title: "Annual Reports", href: "/annual-reports" },
  { title: "Photo Gallery", href: "/photo-gallery" },
  { title: "Video Gallery", href: "/video-gallery" },
] as const;

export default async function ResourceCentreHubPage() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/resource-centre/");
  if (!entry || entry.status !== 200 || !entry.savedAs) notFound();

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const { title, intro } = extractPageIntro(html);

  // Previews (titles/dates only) from existing ACEP listing pages
  const previews = await Promise.all([
    getAcepSnapshotByUrl("https://acep.africa/research-and-policy-papers/"),
    getAcepSnapshotByUrl("https://acep.africa/news-blog-posts/"),
  ]);

  const previewData = await Promise.all(
    previews.map(async (p) => {
      if (!p || p.status !== 200 || !p.savedAs) return { heading: "", items: [] as ReturnType<typeof extractListingItems> };
      const h = await readAcepSnapshotHtml(p.savedAs);
      const items = extractListingItems(h).slice(0, 5);
      // derive heading from the page itself if possible
      const headingMatch = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const heading = headingMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || "";
      return { heading, items };
    })
  );

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            {title || "Resource Centre"}
          </h1>
          {intro && <p className="mt-3 text-base text-slate-600">{intro}</p>}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-xl border border-slate-200 p-5 hover:border-acep-primary/30 hover:shadow-sm transition"
            >
              <div className="text-lg font-semibold text-slate-900 group-hover:text-acep-primary transition-colors">
                {s.title}
              </div>
              <div className="mt-2 text-sm text-slate-600">{s.href}</div>
            </Link>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {previewData.map((block, idx) => (
            <section key={idx} className="rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                {block.heading || (idx === 0 ? "Research and Policy Papers" : "News & Blog Posts")}
              </h2>
              <div className="mt-4 divide-y divide-slate-100">
                {block.items.map((it) => (
                  <div key={it.href} className="py-3">
                    {it.dateText && <div className="text-xs text-slate-500 mb-1">{it.dateText}</div>}
                    <Link
                      href={acepHrefToLocalPath(it.href)}
                      className="text-sm font-semibold text-slate-900 hover:text-acep-primary"
                    >
                      {it.title}
                    </Link>
                  </div>
                ))}
                {block.items.length === 0 && <div className="py-6 text-sm text-slate-600" />}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

