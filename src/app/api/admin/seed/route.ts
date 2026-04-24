import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { runPrismaSeed, trimCliLog } from "@/lib/run-prisma-cli";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not set." }, { status: 503 });
  }

  const cwd = process.cwd();

  try {
    const { stdout, stderr } = await runPrismaSeed(cwd);
    const log = trimCliLog(`${stdout}\n${stderr}`.trim());
    return NextResponse.json({ ok: true, log: log || "(seed produced no stdout)" });
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string; message?: string };
    const log = trimCliLog(`${err.stdout ?? ""}\n${err.stderr ?? ""}\n${err.message ?? ""}`.trim());
    return NextResponse.json({ ok: false, error: "seed_failed", log }, { status: 500 });
  }
}
