"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/portal", label: "Overview", match: (p: string) => p === "/portal" || p === "/portal/" },
  { href: "/portal/profile", label: "Profile", match: (p: string) => p.startsWith("/portal/profile") },
  {
    href: "/portal/contributions",
    label: "Organiser materials",
    match: (p: string) => p.startsWith("/portal/contributions"),
  },
];

export function PortalDashboardNav({ email }: { email: string }) {
  const pathname = usePathname() || "";
  const router = useRouter();

  async function logout() {
    await fetch("/api/portal/logout", { method: "POST", credentials: "include" });
    router.push("/login?from=portal");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <nav className="flex flex-wrap gap-1 text-sm">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-acepBtn px-2.5 py-1.5 font-medium transition",
              l.match(pathname) ? "bg-acep-primary/15 text-acep-primary" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <span className="hidden text-xs text-slate-400 sm:inline">{email}</span>
      <Button type="button" variant="outline" size="sm" onClick={() => void logout()}>
        Sign out
      </Button>
    </div>
  );
}
