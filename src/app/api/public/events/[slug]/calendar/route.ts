import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildIcsForPublishedEvent } from "@/lib/event-calendar-urls";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug: slug.toLowerCase() },
  });
  if (!event || event.status !== "PUBLISHED") {
    return new NextResponse("Not found", { status: 404, headers: { "Content-Type": "text/plain" } });
  }

  const ics = buildIcsForPublishedEvent({
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    location: event.location,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    streamUrl: event.streamUrl,
  });
  const filename = `acep-${event.slug}.ics`;

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
