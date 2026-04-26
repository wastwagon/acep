"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  FileText,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  Calendar,
  Globe2,
  PenLine,
  LayoutTemplate,
  Inbox,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

type LinkItem = { href: string; label: string; icon: LucideIcon; match: (p: string) => boolean };
type NavBlock = { heading: string; items: LinkItem[] };

const BLOCKS: NavBlock[] = [
  {
    heading: "Start",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutGrid,
        match: (p) => p === "/admin" || p === "/admin/",
      },
    ],
  },
  {
    heading: "Content & media",
    items: [
      { href: "/admin/posts", label: "News & posts", icon: FileText, match: (p) => p.startsWith("/admin/posts") },
      { href: "/admin/media", label: "Media library", icon: ImageIcon, match: (p) => p.startsWith("/admin/media") },
    ],
  },
  {
    heading: "Engagement",
    items: [
      { href: "/admin/events", label: "Events & registration", icon: Calendar, match: (p) => p.startsWith("/admin/events") },
      {
        href: "/admin/portal-contributions",
        label: "Organiser materials (portal)",
        icon: Inbox,
        match: (p) => p.startsWith("/admin/portal-contributions"),
      },
      {
        href: "/admin/public-submissions",
        label: "Public form inbox",
        icon: ClipboardList,
        match: (p) => p.startsWith("/admin/public-submissions"),
      },
    ],
  },
  {
    heading: "Public website",
    items: [
      {
        href: "/admin/website",
        label: "Site & media keys",
        icon: Globe2,
        match: (p) => p === "/admin/website" || p === "/admin/website/" || p.startsWith("/admin/content"),
      },
      {
        href: "/admin/marketing-pages",
        label: "Marketing page copy",
        icon: PenLine,
        match: (p) => p.startsWith("/admin/marketing-pages"),
      },
      {
        href: "/admin/marketing-hubs",
        label: "Marketing hub pages",
        icon: LayoutTemplate,
        match: (p) => p.startsWith("/admin/marketing-hubs"),
      },
    ],
  },
  {
    heading: "System",
    items: [
      { href: "/admin/settings", label: "Settings & system", icon: Settings, match: (p) => p.startsWith("/admin/settings") },
    ],
  },
];

export function AdminSidebar({
  userEmail,
  role,
  publicBaseUrl,
}: {
  userEmail: string;
  role: string;
  publicBaseUrl: string;
}) {
  const pathname = usePathname() || "";
  const publicHref = publicBaseUrl || "https://www.acep.africa";

  return (
    <aside className="flex w-full min-w-0 flex-col border-b border-slate-800 bg-slate-900 text-slate-200 lg:sticky lg:top-[6.5rem] lg:max-h-[calc(100dvh-6.5rem)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-slate-800 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">ACEP</p>
          <p className="mt-0.5 font-display text-base font-semibold text-white">Admin</p>
          <p className="mt-1 text-[11px] text-slate-500 leading-snug">
            One console: posts, media, events, site keys, marketing copy
          </p>
        </div>
        <nav className="min-h-0 space-y-4 overflow-y-auto p-2">
          {BLOCKS.map((block) => (
            <div key={block.heading}>
              <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {block.heading}
              </p>
              <div className="space-y-0.5">
                {block.items.map((item) => {
                  const active = item.match(pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-acepBtn px-3 py-2.5 text-sm font-medium transition",
                        active
                          ? "bg-acep-primary/25 text-white ring-1 ring-acep-primary/40"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0 opacity-90" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          <div>
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">External</p>
            <a
              href={publicHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-acepBtn px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
            >
              <ExternalLink className="h-4 w-4 shrink-0 opacity-80" />
              View public site
            </a>
            <Link
              href={`${publicHref.replace(/\/$/, "")}/login?from=portal`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 flex items-center gap-2.5 rounded-acepBtn px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
            >
              <ExternalLink className="h-4 w-4 shrink-0 opacity-80" />
              Participant portal
            </Link>
          </div>
        </nav>
        <div className="mt-auto shrink-0 space-y-2 border-t border-slate-800 p-3 text-xs text-slate-500">
          <p className="break-all">
            <span className="text-slate-500">Signed in as</span>{" "}
            <span className="text-slate-300">{userEmail}</span>{" "}
            <span className="ml-1 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">{role}</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
