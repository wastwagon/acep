import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingProsePage } from "@/components/marketing/marketing-prose-page";
import { resolveProsePage } from "@/lib/resolve-marketing-content";

export const dynamic = "force-dynamic";

const URL = "https://acep.africa/nextgen10/";

export async function generateMetadata(): Promise<Metadata> {
  const r = await resolveProsePage(URL);
  if (!r) return { title: "ACEP" };
  return { title: r.seoTitle, description: r.seoDescription };
}

export default async function NextGenPage() {
  const r = await resolveProsePage(URL);
  if (!r) notFound();
  return <MarketingProsePage {...r} aside="programs" />;
}
