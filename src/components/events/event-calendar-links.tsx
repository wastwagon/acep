type Props = {
  icalHref: string;
  googleHref: string;
  className?: string;
};

/**
 * Download .ics and pre-filled Google Calendar. Server-rendered: pass absolute URLs.
 */
export function EventCalendarLinks({ icalHref, googleHref, className }: Props) {
  return (
    <p className={className ?? "text-sm text-slate-600"}>
      <a href={icalHref} className="text-acep-primary hover:underline" download>
        Download .ics
      </a>{" "}
      <span className="text-slate-400">·</span>{" "}
      <a href={googleHref} target="_blank" rel="noopener noreferrer" className="text-acep-primary hover:underline">
        Add to Google Calendar
      </a>
    </p>
  );
}
