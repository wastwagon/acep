import { NextResponse } from "next/server";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml, transformAcepHtmlForLocalAssets } from "@/lib/acep-snapshots";

export async function GET() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/");
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

