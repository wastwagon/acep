import { mkdir, writeFile, unlink } from "node:fs/promises";
import { join, extname, basename, normalize } from "node:path";
import type { CmsMediaKind } from "@prisma/client";

const MAX_BYTES = 52_428_800; // 50MB

const ALLOWED_MIMES = new Set(
  [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "audio/mpeg",
    "audio/wav",
    "application/pdf",
    "application/zip",
    "text/plain",
    "text/csv",
    "application/json",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
  ].map((m) => m),
);

export function getCmsMediaRoot() {
  const fromEnv = process.env.CMS_MEDIA_DIR?.trim();
  if (fromEnv) {
    return normalize(fromEnv);
  }
  return join(process.cwd(), "public", "media", "cms");
}

export function classifyMediaKind(mime: string, originalName: string): CmsMediaKind {
  const m = mime.toLowerCase();
  if (m.startsWith("image/")) return "IMAGE";
  if (m.startsWith("video/")) return "VIDEO";
  if (m.startsWith("audio/")) return "AUDIO";
  if (m === "application/zip" || m.includes("x-zip") || m.includes("x-rar")) return "ARCHIVE";
  if (
    m === "application/pdf" ||
    m.startsWith("application/vnd.ms-") ||
    m.startsWith("application/vnd.openxmlformats-") ||
    m.startsWith("text/") ||
    m === "application/json"
  ) {
    return "DOCUMENT";
  }
  const ext = extname(originalName).toLowerCase();
  if ([".mp4", ".webm", ".mov"].includes(ext)) return "VIDEO";
  if ([".mp3", ".wav", ".ogg", ".m4a"].includes(ext)) return "AUDIO";
  if ([".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".pdf"].includes(ext)) return "DOCUMENT";
  if ([".zip", ".rar", ".7z", ".tar", ".gz"].includes(ext)) return "ARCHIVE";
  return "OTHER";
}

function safeExt(mime: string, originalName: string) {
  const fromName = extname(basename(originalName)) || ".bin";
  if (fromName.includes("..") || fromName.match(/[\\/]/)) {
    return ".bin";
  }
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "application/pdf": ".pdf",
  };
  const m = map[mime];
  return m || (fromName.length < 6 ? fromName : ".bin");
}

export function validateFileMeta(name: string, size: number, mime: string) {
  if (!name || !Number.isFinite(size) || size <= 0) {
    return { ok: false as const, error: "Invalid file." };
  }
  if (size > MAX_BYTES) {
    return { ok: false as const, error: "File is too large (max 50MB in this build)." };
  }
  if (
    !ALLOWED_MIMES.has(mime) &&
    !mime.startsWith("image/") &&
    !mime.startsWith("video/") &&
    !mime.startsWith("audio/")
  ) {
    return { ok: false as const, error: "File type is not allowed." };
  }
  return { ok: true as const };
}

/**
 * Write bytes to disk. Returns { storageFile, publicPath }.
 */
export async function saveCmsFile(params: { id: string; originalName: string; mime: string; buffer: Buffer }) {
  const { id, originalName, mime, buffer } = params;
  const ext = safeExt(mime, originalName);
  const fileName = `${id}${ext}`;
  const root = getCmsMediaRoot();
  await mkdir(root, { recursive: true });
  if (fileName.includes("..") || /[\\/]/.test(fileName)) {
    throw new Error("path_escape");
  }
  const filePath = join(root, fileName);
  await writeFile(filePath, buffer);
  return {
    storageFile: fileName,
    publicPath: `/media/cms/${fileName}`,
  };
}

export async function removeCmsFileOnDisk(storageFile: string) {
  const name = basename(normalize(storageFile));
  if (name.includes("..") || /[\\/]/.test(name)) {
    return;
  }
  try {
    await unlink(join(getCmsMediaRoot(), name));
  } catch {
    // ignore
  }
}

export function getAbsoluteFileUrl(relativePath: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3100";
  return `${base}${relativePath}`;
}
