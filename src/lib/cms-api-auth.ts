import { NextRequest, NextResponse } from "next/server";
import { getCmsUserFromToken, CMS_SESSION_COOKIE } from "@/lib/cms-auth";

export async function requireCmsApiUser(req: NextRequest) {
  const token = req.cookies.get(CMS_SESSION_COOKIE)?.value;
  const user = await getCmsUserFromToken(token);
  if (!user) {
    return {
      denied: NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 }),
      user: null,
    };
  }
  return { denied: null, user };
}
