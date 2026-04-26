import Link from "next/link";

export default async function EInvalidPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const msg =
    reason === "token"
      ? "This confirmation link is invalid or has already been used."
      : reason === "cancelled"
        ? "This registration was cancelled."
        : reason === "speaker"
          ? "This speaker link is invalid, expired, or was replaced by a new invite. Ask the organiser to resend your link from the admin event page."
          : "The link is invalid or incomplete.";

  const title = reason === "speaker" ? "Invalid speaker link" : "Could not confirm";

  return (
    <div className="container mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{msg}</p>
      <Link href="/" className="mt-6 inline-block text-acep-primary hover:underline">
        Home
      </Link>
    </div>
  );
}
