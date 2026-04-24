import { getAllPublications } from "@/lib/data/posts";
import { loadPdfRegistry, getDocumentSearchItems } from "@/lib/data/pdf-registry";
import { UnifiedPublications } from "@/components/shared/unified-publications";

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
  const [allPublications, registry] = await Promise.all([
    getAllPublications(),
    loadPdfRegistry(),
  ]);
  const pdfPages = getDocumentSearchItems(registry);

  return <UnifiedPublications items={allPublications} pdfPages={pdfPages} />;
}
