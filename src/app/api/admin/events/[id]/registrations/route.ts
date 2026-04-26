import { NextRequest, NextResponse } from "next/server";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const [items, exhibitorItems] = await Promise.all([
    prisma.eventRegistration.findMany({
      where: { eventId: id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.eventExhibitorRegistration.findMany({
      where: { eventId: id },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return NextResponse.json({ ok: true, items, exhibitorItems });
}
