import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { notifyStaffPortalContributionIfConfigured } from "@/lib/event-mail";
import { requirePortalApiUser } from "@/lib/portal-api-auth";
import { portalUserHasEventAccess } from "@/lib/portal-auth";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  eventId: z.string().min(1),
  title: z.string().max(300).optional().default(""),
  body: z.string().max(20000).default(""),
  submit: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const { denied, user } = await requirePortalApiUser(req);
  if (denied || !user) return denied!;

  const items = await prisma.eventContribution.findMany({
    where: { portalUserId: user.id },
    include: { event: { select: { id: true, title: true, slug: true } } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  const { denied, user } = await requirePortalApiUser(req);
  if (denied || !user) return denied!;

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_data" }, { status: 400 });
  }

  const { eventId, title, body: text, submit } = parsed.data;
  if (submit && !text.trim()) {
    return NextResponse.json({ ok: false, error: "empty_body" }, { status: 400 });
  }
  const allowed = await portalUserHasEventAccess(user.id, eventId);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: "forbidden_event" }, { status: 403 });
  }

  const row = await prisma.eventContribution.create({
    data: {
      portalUserId: user.id,
      eventId,
      title: title.trim(),
      body: text.trim(),
      status: submit ? "SUBMITTED" : "DRAFT",
      moderationStatus: submit ? "PENDING" : "NONE",
    },
    include: { event: { select: { id: true, title: true, slug: true } } },
  });

  if (submit && row.moderationStatus === "PENDING") {
    notifyStaffPortalContributionIfConfigured({ eventTitle: row.event.title, contributorEmail: user.email });
  }

  return NextResponse.json({ ok: true, item: row });
}
