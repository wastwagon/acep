import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MarketingHubPage } from "@/components/marketing/marketing-hub-page";
import { getCmsContentMapCached } from "@/lib/cms-content-public";
import { mergeHubCardImages, marketingHubCmsId } from "@/lib/marketing-cms-hub";
import { getHubBuiltin, acepKey } from "@/lib/marketing-builtin";
import { resolveHubPage, resolveResourceCentrePreviews } from "@/lib/resolve-marketing-content";
import { acepHrefToLocalPath } from "@/lib/acep-extract";

export const dynamic = "force-dynamic";

const HUB = "https://acep.africa/resource-centre/";

export async function generateMetadata(): Promise<Metadata> {
  const r = await resolveHubPage(HUB);
  const b = getHubBuiltin(acepKey("resource-centre"))!;
  return { title: r?.seoTitle ?? b.meta.title, description: r?.seoDescription ?? b.meta.description };
}

export default async function ResourceCentreHubPage() {
  const r = await resolveHubPage(HUB);
  const b = getHubBuiltin(acepKey("resource-centre"));
  if (!b) notFound();
  const previewData = await resolveResourceCentrePreviews();
  const cms = await getCmsContentMapCached();
  const links = mergeHubCardImages(b.links, marketingHubCmsId("resource-centre"), cms);

  return (
    <div>
      <MarketingHubPage title={r?.title ?? b.title} intro={r?.intro ?? b.intro} links={links} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {previewData.map((block, idx) => (
            <section key={idx} className="rounded-acepCard border border-slate-200 p-6 bg-white">
              <h2 className="text-lg font-semibold text-slate-900">
                {block.heading}
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
                {block.items.length === 0 && (
                  <p className="py-4 text-sm text-slate-600">No snapshot listings yet. Browse the sections above or add posts in the CMS.</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
