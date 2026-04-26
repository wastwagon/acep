import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyStaffPublicFormSubmissionIfConfigured } from "@/lib/event-mail";
import { parsePublicFormSubmissionBody } from "@/lib/public-form-submission";
import { checkEventPublicRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = await checkEventPublicRateLimit(`public-form:${ip}`);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfterSec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  const raw = (await req.json().catch(() => null)) as unknown;
  const parsed = parsePublicFormSubmissionBody(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_data" }, { status: 400 });
  }

  const { kind, data } = parsed.data;
  const prismaKind = kind === "ELECTRICITY_COMPLAINT" ? "ELECTRICITY_COMPLAINT" : "TAX_WHISTLEBLOWER";

  try {
    const row = await prisma.publicFormSubmission.create({
      data: {
        kind: prismaKind,
        payload: data as object,
      },
    });
    notifyStaffPublicFormSubmissionIfConfigured({ kind: prismaKind, submissionId: row.id });
    return NextResponse.json({ ok: true, id: row.id });
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
