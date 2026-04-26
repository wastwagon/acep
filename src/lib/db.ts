import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/**
 * Ensure PostgreSQL connections fail within a few seconds when the host is down
 * (otherwise the homepage can hang indefinitely on `prisma.*` calls).
 */
function prismaDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return undefined;
  if (raw.startsWith("prisma+")) return raw;
  const lower = raw.toLowerCase();
  if (!lower.startsWith("postgresql://") && !lower.startsWith("postgres://")) {
    return raw;
  }
  try {
    const u = new URL(raw);
    if (!u.searchParams.has("connect_timeout")) {
      u.searchParams.set("connect_timeout", "10");
    }
    return u.toString();
  } catch {
    return raw;
  }
}

const dbUrl = prismaDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(dbUrl ? { datasources: { db: { url: dbUrl } } } : {}),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
