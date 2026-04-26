import { NextRequest, NextResponse } from "next/server";
import { getPortalUserFromToken, PORTAL_SESSION_COOKIE } from "@/lib/portal-auth";

export async function requirePortalApiUser(req: NextRequest) {
  const token = req.cookies.get(PORTAL_SESSION_COOKIE)?.value;
  const user = await getPortalUserFromToken(token);
  if (!user) {
    return {
      denied: NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 }),
      user: null,
    };
  }
  return { denied: null, user };
}
