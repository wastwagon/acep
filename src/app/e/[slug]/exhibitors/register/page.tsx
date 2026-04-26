import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { EventExhibitorRegisterForm } from "@/components/events/event-exhibitor-register-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ExhibitorRegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug: slug.toLowerCase() } });
  if (!event || event.status !== "PUBLISHED") {
    notFound();
  }
  if (!event.publicExhibitorRegistration) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="font-display text-2xl font-semibold text-slate-900">{event.title}</h1>
        <p className="mt-2 text-sm text-slate-600">Exhibitor registration is not open for this event.</p>
        <Link href={`/e/${encodeURIComponent(event.slug)}`} className="mt-4 inline-block text-acep-primary hover:underline">
          Event page
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href={`/e/${encodeURIComponent(event.slug)}`} className="text-sm text-acep-primary hover:underline">
        ← {event.title}
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-slate-900">Exhibitor registration</h1>
      <p className="mt-1 text-sm text-slate-600">Register your organisation for this event. You will confirm by email.</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Register your booth / company</CardTitle>
        </CardHeader>
        <CardContent>
          <EventExhibitorRegisterForm eventSlug={event.slug} eventTitle={event.title} />
        </CardContent>
      </Card>
    </div>
  );
}
