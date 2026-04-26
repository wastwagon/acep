import { NextRequest, NextResponse } from "next/server";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { csvLine } from "@/lib/csv-escape";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function iso(d: Date | null | undefined): string {
  if (!d) return "";
  return d.toISOString();
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const { id: eventId } = await params;
  const scope = req.nextUrl.searchParams.get("scope") ?? "registrations";
  if (scope !== "registrations" && scope !== "speakers") {
    return NextResponse.json({ ok: false, error: "invalid_scope" }, { status: 400 });
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, slug: true },
  });
  if (!event) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  if (scope === "speakers") {
    const speakers = await prisma.eventSpeaker.findMany({
      where: { eventId },
      orderBy: { createdAt: "asc" },
      select: {
        displayName: true,
        email: true,
        title: true,
        bio: true,
        lastInviteSentAt: true,
        firstOpenedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const lines: string[] = [
      csvLine([
        "Display name",
        "Email",
        "Session title",
        "Bio",
        "Last invite sent at",
        "First opened link at",
        "Created at",
        "Updated at",
      ]),
    ];
    for (const s of speakers) {
      lines.push(
        csvLine([
          s.displayName,
          s.email,
          s.title ?? "",
          s.bio ?? "",
          iso(s.lastInviteSentAt),
          iso(s.firstOpenedAt),
          iso(s.createdAt),
          iso(s.updatedAt),
        ])
      );
    }
    const body = "\ufeff" + lines.join("");
    const filename = `event-${event.slug}-speakers.csv`;
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "no-store",
      },
    });
  }

  const [attendees, exhibitors] = await Promise.all([
    prisma.eventRegistration.findMany({ where: { eventId }, orderBy: { createdAt: "asc" } }),
    prisma.eventExhibitorRegistration.findMany({ where: { eventId }, orderBy: { createdAt: "asc" } }),
  ]);

  const lines: string[] = [
    csvLine([
      "Type",
      "Display name",
      "Email",
      "Status",
      "Check-in code",
      "Phone",
      "Extra (org / contact)",
      "Confirmed at",
      "Checked in at",
      "Registered at",
    ]),
  ];
  for (const r of attendees) {
    lines.push(
      csvLine([
        "attendee",
        r.fullName,
        r.email,
        r.status,
        r.checkInCode,
        r.phone ?? "",
        r.organisation ?? "",
        iso(r.confirmedAt),
        iso(r.checkedInAt),
        iso(r.createdAt),
      ])
    );
  }
  for (const r of exhibitors) {
    const extra = [r.contactName && `Contact: ${r.contactName}`, r.website && `Web: ${r.website}`].filter(Boolean).join(" · ");
    lines.push(
      csvLine([
        "exhibitor",
        r.companyName,
        r.email,
        r.status,
        r.checkInCode,
        r.phone ?? "",
        extra,
        iso(r.confirmedAt),
        iso(r.checkedInAt),
        iso(r.createdAt),
      ])
    );
  }

  const body = "\ufeff" + lines.join("");
  const filename = `event-${event.slug}-registrations.csv`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "no-store",
    },
  });
}
