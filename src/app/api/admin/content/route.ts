import { NextRequest, NextResponse } from "next/server";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      value: z.string(),
    })
  ),
});

export async function GET(req: NextRequest) {
  const { denied } = await requireCmsApiUser(req);
  if (denied) return denied;

  const group = req.nextUrl.searchParams.get("group");
  const entries = await prisma.cmsContentEntry.findMany({
    where: group ? { groupKey: group } : undefined,
    orderBy: [{ groupKey: "asc" }, { sortOrder: "asc" }],
  });

  return NextResponse.json({
    ok: true,
    items: entries.map((e) => ({
      id: e.id,
      key: e.key,
      label: e.label,
      groupKey: e.groupKey,
      description: e.description,
      value: e.value,
      valueType: e.valueType,
      sortOrder: e.sortOrder,
      updatedAt: e.updatedAt.toISOString(),
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  for (const row of parsed.data.items) {
    await prisma.cmsContentEntry.update({
      where: { id: row.id },
      data: { value: row.value, updatedById: user.id },
    });
  }

  return NextResponse.json({ ok: true });
}
