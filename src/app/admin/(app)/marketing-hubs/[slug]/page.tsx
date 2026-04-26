import { notFound } from "next/navigation";
import { isMarketingHubSlug } from "@/lib/marketing-hub-slugs";
import { MarketingHubEditorForm } from "@/components/admin/marketing-hub-editor-form";

type Props = { params: Promise<{ slug: string }> };

export default async function MarketingHubEditPage({ params }: Props) {
  const { slug } = await params;
  if (!isMarketingHubSlug(slug)) {
    notFound();
  }
  const publicBase = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3100").replace(/\/$/, "");
  const publicPath = `${publicBase}/${slug}/`;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Edit hub: /{slug}</h1>
        <p className="mt-1 text-sm text-slate-600">Hub index — title and intro only. Slug: {slug}</p>
      </div>
      <MarketingHubEditorForm slug={slug} publicPath={publicPath} />
    </div>
  );
}
