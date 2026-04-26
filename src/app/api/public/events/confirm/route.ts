import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashToken } from "@/lib/event-crypto";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token || token.length < 8) {
    return NextResponse.redirect(new URL("/e/invalid?reason=invalid", req.nextUrl));
  }
  const h = hashToken(token);
  const reg = await prisma.eventRegistration.findFirst({
    where: { confirmationTokenHash: h },
    include: { event: { select: { id: true, slug: true } } },
  });
  if (!reg) {
    return NextResponse.redirect(new URL("/e/invalid?reason=token", req.nextUrl));
  }
  if (reg.status === "CANCELLED") {
    return NextResponse.redirect(new URL("/e/invalid?reason=cancelled", req.nextUrl));
  }

  await prisma.eventRegistration.update({
    where: { id: reg.id },
    data: {
      status: "CONFIRMED",
      confirmedAt: reg.confirmedAt ?? new Date(),
    },
  });

  return NextResponse.redirect(
    new URL(
      `/e/${encodeURIComponent(reg.event.slug)}/registered?c=${encodeURIComponent(reg.checkInCode)}`,
      req.nextUrl
    )
  );
}
