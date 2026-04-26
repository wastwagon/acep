import { NextResponse } from "next/server";

import packageJson from "../../../../package.json";

export const dynamic = "force-dynamic";

/**
 * Liveness for load balancers and ops. No DB check (avoids false negatives when DB is down for migrate).
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      time: new Date().toISOString(),
      version: packageJson.version,
    },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
