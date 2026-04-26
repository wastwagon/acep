import { EventAdminForm } from "@/components/events/event-admin-form";

export default function AdminEventNewPage() {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">New event</h1>
      <EventAdminForm mode="create" />
    </div>
  );
}
