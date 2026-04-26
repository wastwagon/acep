import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePortalApiUser } from "@/lib/portal-api-auth";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  displayName: z.string().min(1).max(200),
  phone: z.string().max(40).nullable().optional(),
  organisation: z.string().max(200).nullable().optional(),
  bio: z.string().max(8000).nullable().optional(),
});

export async function PATCH(req: NextRequest) {
  const { denied, user } = await requirePortalApiUser(req);
  if (denied || !user) return denied!;

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_data" }, { status: 400 });
  }

  const d = parsed.data;
  const updated = await prisma.portalUser.update({
    where: { id: user.id },
    data: {
      displayName: d.displayName.trim(),
      phone: d.phone?.trim() || null,
      organisation: d.organisation?.trim() || null,
      bio: d.bio?.trim() || null,
    },
  });

  await prisma.eventSpeaker.updateMany({
    where: { portalUserId: user.id },
    data: { displayName: d.displayName.trim() },
  });

  return NextResponse.json({
    ok: true,
    user: {
      id: updated.id,
      email: updated.email,
      displayName: updated.displayName,
      phone: updated.phone,
      organisation: updated.organisation,
      bio: updated.bio,
    },
  });
}
