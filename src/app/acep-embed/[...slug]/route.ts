import { NextResponse } from "next/server";
import { acepUrlFromSlug, getAcepSnapshotByUrl, readAcepSnapshotHtml, transformAcepHtmlForLocalAssets } from "@/lib/acep-snapshots";

export async function GET(_req: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params;
  const url = acepUrlFromSlug(slug);
  const entry = await getAcepSnapshotByUrl(url);

  if (!entry || entry.status !== 200 || !entry.savedAs) {
    return new NextResponse("Not found", { status: 404 });
  }

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const transformed = transformAcepHtmlForLocalAssets(html, {
    extractBody: false,
    baseTargetTop: true,
    hideAcepChrome: true,
  });

  return new NextResponse(transformed, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

