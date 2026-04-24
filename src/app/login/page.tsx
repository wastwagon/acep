import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Sign in</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Member and staff sign-in is not enabled on this preview yet. Use the rest of the site or contact ACEP for
        access.
      </p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
        Back to home
      </Link>
    </div>
  );
}
