import { NextRequest, NextResponse } from "next/server";

/**
 * Validates admin secret from `x-admin-secret` header or JSON body `{ "secret": "..." }`.
 * Returns a NextResponse error, or `null` when authorised.
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const configured = process.env.ADMIN_SECRET?.trim();
  if (!configured) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_SECRET is not configured on the server." },
      { status: 503 },
    );
  }

  let secret = req.headers.get("x-admin-secret") ?? "";
  if (!secret) {
    try {
      const body = (await req.json()) as { secret?: string };
      secret = typeof body.secret === "string" ? body.secret : "";
    } catch {
      return NextResponse.json(
        { ok: false, error: "Send header x-admin-secret or JSON body { \"secret\": \"...\" }." },
        { status: 400 },
      );
    }
  }

  if (secret !== configured) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  return null;
}
