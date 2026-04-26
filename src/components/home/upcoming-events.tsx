import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

const events = [
  {
    title: "Call for Applications: Next Generation Resource Governance Leaders Program (Cohort 10)",
    date: "Application Deadline: February 15, 2026",
    location: "Virtual & In-Person (Accra)",
    time: "Applications Open",
    type: "Call for Applications",
  },
];

export function UpcomingEvents() {
  return (
    <section className="section-shell bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center md:mb-12">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Program Calendar</p>
            <h2 className="font-display mb-2 text-3xl font-medium tracking-[-0.02em] text-slate-900 md:text-[2.15rem]">
              Events & Opportunities
            </h2>
            <p className="text-sm text-slate-600">
              Upcoming events and application opportunities
            </p>
          </div>
          <Link
            href="/events"
            className="institutional-link"
          >
            View all events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <Card key={index} className="institutional-card institutional-card-hover">
              <CardHeader>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-acep-secondary">
                  {event.type}
                </div>
                <CardTitle className="text-lg sm:text-xl text-slate-900 hover:text-acep-primary transition-colors">
                  <Link href="/nextgen10">{event.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 text-sm">
                    <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-acep-primary" />
                    <span className="text-slate-700">{event.date}</span>
                  </div>
                  <div className="flex items-start space-x-3 text-sm">
                    <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-acep-primary" />
                    <span className="text-slate-700">{event.location}</span>
                  </div>
                  <div className="flex items-start space-x-3 text-sm">
                    <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-acep-primary" />
                    <span className="text-slate-700">{event.time}</span>
                  </div>
                  <div className="pt-4">
                    <Link
                      href="/nextgen10"
                      className="inline-flex items-center rounded-acepBtn bg-acep-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-acep-primary/90"
                    >
                      Learn more & apply
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* CTA Card */}
          <Card className="rounded-acepCard border border-slate-200 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Future of Energy Conference 2026
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-white/85">
                Join Africa&apos;s premier energy conference. Discussions on financing energy access and economic transformation.
              </p>
              <Link
                href="/fec-2025"
                className="inline-flex items-center rounded-acepBtn bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
              >
                Learn more
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
