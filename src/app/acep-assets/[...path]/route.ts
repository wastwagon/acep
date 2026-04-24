import { NextResponse } from "next/server";
import path from "node:path";
import { readFile } from "node:fs/promises";

function contentTypeForExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".pdf":
      return "application/pdf";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".ico":
      return "image/x-icon";
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    case ".ttf":
      return "font/ttf";
    case ".mp3":
      return "audio/mpeg";
    case ".mp4":
      return "video/mp4";
    case ".csv":
      return "text/csv; charset=utf-8";
    case ".zip":
      return "application/zip";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  // Map to content/acep/assets/acep.africa/<path...>
  const rel = params.path.join("/");
  const abs = path.resolve(process.cwd(), "content", "acep", "assets", "acep.africa", rel);

  // Basic safety: prevent escaping the content folder
  const root = path.resolve(process.cwd(), "content", "acep", "assets", "acep.africa");
  if (!abs.startsWith(root)) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  try {
    const buf = await readFile(abs);
    const ext = path.extname(abs);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "content-type": contentTypeForExt(ext),
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

