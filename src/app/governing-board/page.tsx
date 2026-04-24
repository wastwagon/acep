import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml } from "@/lib/acep-snapshots";
import { extractPageIntro } from "@/lib/acep-page-extract";
import { extractAcepMainContentHtml } from "@/lib/acep-content";

export const dynamic = "force-dynamic";

const aboutRail = [
  { title: "About Us", href: "/about-us" },
  { title: "The Organisation", href: "/the-organisation" },
  { title: "Governing Board", href: "/governing-board" },
  { title: "Our Team", href: "/team" },
  { title: "Our Partners", href: "/our-partners" },
] as const;

export default async function GoverningBoardPage() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/governing-board/");
  if (!entry || entry.status !== 200 || !entry.savedAs) notFound();

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const { title, intro, heroImage } = extractPageIntro(html);
  const contentHtml = extractAcepMainContentHtml(html);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{title || "Governing Board"}</h1>
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
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="acep-rich prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="text-sm font-semibold text-slate-900 mb-3">About</div>
                <div className="space-y-2 text-sm">
                  {aboutRail.map((l) => (
                    <Link key={l.href} className="block text-slate-700 hover:text-acep-primary" href={l.href}>
                      {l.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

