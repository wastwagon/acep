import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingHubPage } from "@/components/marketing/marketing-hub-page";
import { getCmsContentMapCached } from "@/lib/cms-content-public";
import { mergeHubCardImages, marketingHubCmsId } from "@/lib/marketing-cms-hub";
import { resolveHubPage } from "@/lib/resolve-marketing-content";
import { getHubBuiltin, acepKey } from "@/lib/marketing-builtin";

export const dynamic = "force-dynamic";

const HUB = "https://acep.africa/programs/";

export async function generateMetadata(): Promise<Metadata> {
  const r = await resolveHubPage(HUB);
  const b = getHubBuiltin(acepKey("programs"))!;
  return { title: r?.seoTitle ?? b.meta.title, description: r?.seoDescription ?? b.meta.description };
}

export default async function ProgramsHubPage() {
  const r = await resolveHubPage(HUB);
  const b = getHubBuiltin(acepKey("programs"));
  if (!b) notFound();
  const cms = await getCmsContentMapCached();
  const links = mergeHubCardImages(b.links, marketingHubCmsId("programs"), cms);
  return <MarketingHubPage title={r?.title ?? b.title} intro={r?.intro ?? b.intro} links={links} />;
}
