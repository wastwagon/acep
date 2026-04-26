import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { notifyStaffPortalContributionIfConfigured } from "@/lib/event-mail";
import { requirePortalApiUser } from "@/lib/portal-api-auth";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  title: z.string().max(300).optional(),
  body: z.string().max(20000).optional(),
  submit: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { denied, user } = await requirePortalApiUser(req);
  if (denied || !user) return denied!;

  const { id } = await ctx.params;
  const row = await prisma.eventContribution.findFirst({
    where: { id, portalUserId: user.id },
  });
  if (!row) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_data" }, { status: 400 });
  }

  const d = parsed.data;
  const submittedLocked =
    row.status === "SUBMITTED" &&
    (row.moderationStatus === "PENDING" || row.moderationStatus === "APPROVED") &&
    (d.body !== undefined || d.title !== undefined);
  if (submittedLocked) {
    return NextResponse.json({ ok: false, error: "locked" }, { status: 400 });
  }

  if (d.submit) {
    const nextBody = d.body !== undefined ? d.body : row.body;
    if (!nextBody.trim()) {
      return NextResponse.json({ ok: false, error: "empty_body" }, { status: 400 });
    }
  }

  if (d.submit && row.status === "SUBMITTED") {
    if (row.moderationStatus === "REJECTED" || row.moderationStatus === "NONE") {
      const updated = await prisma.eventContribution.update({
        where: { id: row.id },
        data: {
          ...(d.title !== undefined ? { title: d.title.trim() } : {}),
          ...(d.body !== undefined ? { body: d.body } : {}),
          moderationStatus: "PENDING",
        },
        include: { event: { select: { id: true, title: true, slug: true } } },
      });
      notifyStaffPortalContributionIfConfigured({
        eventTitle: updated.event.title,
        contributorEmail: user.email,
      });
      return NextResponse.json({ ok: true, item: updated });
    }
    const updated = await prisma.eventContribution.findFirst({
      where: { id: row.id },
      include: { event: { select: { id: true, title: true, slug: true } } },
    });
    return NextResponse.json({ ok: true, item: updated });
  }

  const updated = await prisma.eventContribution.update({
    where: { id: row.id },
    data: {
      ...(d.title !== undefined ? { title: d.title.trim() } : {}),
      ...(d.body !== undefined ? { body: d.body } : {}),
      ...(d.submit && row.status === "DRAFT"
        ? { status: "SUBMITTED" as const, moderationStatus: "PENDING" as const }
        : {}),
    },
    include: { event: { select: { id: true, title: true, slug: true } } },
  });

  if (d.submit && row.status === "DRAFT") {
    notifyStaffPortalContributionIfConfigured({
      eventTitle: updated.event.title,
      contributorEmail: user.email,
    });
  }

  return NextResponse.json({ ok: true, item: updated });
}
