import Link from "next/link";
import { FileQuestion, Home, Library } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-slate-50 to-white px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-acep-primary/10 text-acep-primary">
          <FileQuestion className="h-8 w-8" strokeWidth={1.75} aria-hidden />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wider text-acep-primary">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-slate-600">
          The page you requested does not exist or may have been moved. Try the home page or publications
          library.
        </p>
        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-acep-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-acep-primary/90"
          >
            <Home className="h-4 w-4" aria-hidden />
            Home
          </Link>
          <Link
            href="/publications"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-acep-primary/30 hover:bg-slate-50"
          >
            <Library className="h-4 w-4 text-acep-primary" aria-hidden />
            Publications
          </Link>
        </div>
      </div>
    </div>
  );
}
