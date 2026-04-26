import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CMS_SESSION_COOKIE, hashSessionToken } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(CMS_SESSION_COOKIE)?.value;
  if (token) {
    await prisma.cmsSession
      .deleteMany({
        where: { tokenHash: hashSessionToken(token) },
      })
      .catch(() => null);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: CMS_SESSION_COOKIE,
    value: "",
    path: "/",
    expires: new Date(0),
  });
  return res;
}
