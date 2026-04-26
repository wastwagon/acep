import { NextRequest, NextResponse } from "next/server";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { runPrismaMigrateDeploy, trimCliLog } from "@/lib/run-prisma-cli";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;
  if (user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not set." }, { status: 503 });
  }

  const cwd = process.cwd();

  try {
    const { stdout, stderr } = await runPrismaMigrateDeploy(cwd);
    const log = trimCliLog(`${stdout}\n${stderr}`.trim());
    return NextResponse.json({ ok: true, log });
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string; message?: string };
    const log = trimCliLog(`${err.stdout ?? ""}\n${err.stderr ?? ""}\n${err.message ?? ""}`.trim());
    return NextResponse.json({ ok: false, error: "migrate_failed", log }, { status: 500 });
  }
}
