import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

const events = [
  {
    date: "Feb 2026",
    title: "Future of Energy Conference 2026",
    href: "/fec-2025",
  },
  {
    date: "15 Feb 2026",
    title: "NextGen Program Cohort 10 Applications",
    href: "/nextgen10",
  },
  {
    date: "Mar 2026",
    title: "Africa Climate Academy Launch",
    href: "/climate-academy",
  },
];

export function IEAEvents() {
  return (
    <section className="border-b border-slate-200 bg-[#fafaf9] py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-slate-900">Events</h2>
          <Link href="/events">
            <Button variant="ghost" className="text-acep-primary hover:text-acep-primary">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {events.map((event, index) => (
            <Link
              key={index}
              href={event.href}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-colors group"
            >
              <div className="flex-shrink-0">
                <Calendar className="h-5 w-5 text-acep-primary" />
              </div>
              <div className="flex-1">
                <div className="mb-1 text-sm font-semibold text-slate-500">{event.date}</div>
                <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-acep-primary">
                  {event.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
