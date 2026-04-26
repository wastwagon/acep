import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingProsePage } from "@/components/marketing/marketing-prose-page";
import { resolveProsePage } from "@/lib/resolve-marketing-content";

export const dynamic = "force-dynamic";

const URL = "https://acep.africa/climate-academy/";

export async function generateMetadata(): Promise<Metadata> {
  const r = await resolveProsePage(URL);
  if (!r) return { title: "ACEP" };
  return { title: r.seoTitle, description: r.seoDescription };
}

export default async function ClimateAcademyPage() {
  const r = await resolveProsePage(URL);
  if (!r) notFound();
  return <MarketingProsePage {...r} aside="programs" />;
}
