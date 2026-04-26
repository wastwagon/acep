import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  action: z.enum(["approve", "reject", "unpublish"]),
});

/**
 * Approve, reject, or remove from public (unpublish) participant organiser materials.
 * Only `SUBMITTED` rows can be approved or rejected. Unpublish is only for `APPROVED` rows.
 */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied || !user) return denied!;

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_data" }, { status: 400 });
  }
  const action = parsed.data.action;

  const row = await prisma.eventContribution.findUnique({
    where: { id },
    include: { event: { select: { slug: true } } },
  });
  if (!row) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const now = new Date();
  const bumpPublicPage = () => {
    revalidatePath(`/e/${row.event.slug}`);
  };

  if (action === "unpublish") {
    if (row.moderationStatus !== "APPROVED") {
      return NextResponse.json({ ok: false, error: "not_approved" }, { status: 400 });
    }
    await prisma.eventContribution.update({
      where: { id: row.id },
      data: {
        moderationStatus: "REJECTED",
        reviewedAt: now,
        reviewedById: user.id,
      },
    });
    bumpPublicPage();
    return NextResponse.json({ ok: true, moderationStatus: "REJECTED" });
  }

  if (row.status !== "SUBMITTED") {
    return NextResponse.json({ ok: false, error: "not_submitted" }, { status: 400 });
  }

  if (action === "approve") {
    await prisma.eventContribution.update({
      where: { id: row.id },
      data: {
        moderationStatus: "APPROVED",
        reviewedAt: now,
        reviewedById: user.id,
      },
    });
    bumpPublicPage();
    return NextResponse.json({ ok: true, moderationStatus: "APPROVED" });
  }

  // reject
  await prisma.eventContribution.update({
    where: { id: row.id },
    data: {
      moderationStatus: "REJECTED",
      reviewedAt: now,
      reviewedById: user.id,
    },
  });
  bumpPublicPage();
  return NextResponse.json({ ok: true, moderationStatus: "REJECTED" });
}
