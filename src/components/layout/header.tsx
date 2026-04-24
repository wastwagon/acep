"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type FocusEvent as ReactFocusEvent } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { SiteTopBar } from "@/components/layout/site-top-bar";
import { NAV_ITEMS, hasMegaMenu, type NavItem } from "@/components/layout/nav-config";
import { MegaMenuPanel } from "@/components/layout/mega-menu-panel";

const MEGA_PANEL_ID = "site-mega-menu";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const closeMenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMegaTriggerRef = useRef<HTMLElement | null>(null);
  const cancelCloseMenu = () => {
    if (closeMenuTimerRef.current) {
      clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
  };

  const scheduleCloseMenu = () => {
    cancelCloseMenu();
    closeMenuTimerRef.current = setTimeout(() => {
      setOpenSubmenu(null);
      closeMenuTimerRef.current = null;
    }, 380);
  };

  const active = useMemo(() => {
    const current = pathname || "/";
    const normalize = (p: string) => (p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p);
    const cur = normalize(current);

    function isLinkActive(href: string): boolean {
      const h = normalize(href);
      if (h === "#") return false;
      if (h === "/") return cur === "/";
      return cur === h || cur.startsWith(`${h}/`);
    }

    function isItemActive(item: NavItem): boolean {
      if (hasMegaMenu(item)) {
        if (item.href !== "#" && isLinkActive(item.href)) return true;
        return item.submenu.some((s) => isLinkActive(s.href));
      }
      return isLinkActive(item.href);
    }

    return { isLinkActive, isItemActive };
  }, [pathname]);

  const openMegaItem = useMemo(() => {
    if (!openSubmenu) return null;
    const found = NAV_ITEMS.find((i) => hasMegaMenu(i) && i.name === openSubmenu);
    return found && hasMegaMenu(found) ? found : null;
  }, [openSubmenu]);

  useEffect(() => {
    setOpenSubmenu(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!openMegaItem) return;
    const close = () => setOpenSubmenu(null);
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [openMegaItem]);

  useEffect(() => {
    if (!openMegaItem) return;
    const main = document.getElementById("site-main");
    main?.setAttribute("inert", "");
    main?.setAttribute("aria-hidden", "true");
    return () => {
      main?.removeAttribute("inert");
      main?.removeAttribute("aria-hidden");
    };
  }, [openMegaItem]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenSubmenu(null);
        setMobileMenuOpen(false);
        queueMicrotask(() => lastMegaTriggerRef.current?.focus());
      }
    }
    function onPointerDown(e: MouseEvent) {
      const root = headerRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) {
        setOpenSubmenu(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
      if (closeMenuTimerRef.current) {
        clearTimeout(closeMenuTimerRef.current);
        closeMenuTimerRef.current = null;
      }
    };
  }, []);

  const desktopNavLinkBase =
    "relative rounded-full px-2 py-2 text-[12px] font-medium tracking-tight transition-colors duration-200 sm:px-2.5 sm:text-[13px] xl:px-3 xl:tracking-wide";
  const desktopNavLinkInactive = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
  const desktopNavLinkActive = "text-slate-900 bg-slate-100";
  const mobileNavLinkBase = "block rounded-md px-4 py-3 text-base font-semibold transition-all duration-200";

  return (
    <>
      {/* Top strip + full-width main nav (no side inset, no radius) */}
      <div ref={headerRef} className="fixed left-0 right-0 top-0 z-50 flex w-full flex-col">
        <SiteTopBar />
        <div className="w-full">
        <header
          className={`relative w-full rounded-none border-x-0 border-b border-slate-200/90 bg-white/95 shadow-none backdrop-blur-xl transition-[box-shadow,background-color,border-color] duration-300 ${
            scrolled ? "border-slate-200 bg-white shadow-sm" : ""
          }`}
          onMouseEnter={cancelCloseMenu}
          onMouseLeave={scheduleCloseMenu}
        >
        <nav className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3 lg:h-[4.25rem] lg:gap-6">
            {/* Brand */}
            <Link
              href="/"
              className="group flex shrink-0 items-center"
              onMouseEnter={() => {
                cancelCloseMenu();
                setOpenSubmenu(null);
              }}
            >
              <img
                src="/acep-assets/wp-content/uploads/2024/05/ACEP-LOGO-main-1.webp"
                alt="ACEP"
                className="h-8 w-auto transition-opacity group-hover:opacity-90 md:h-9"
              />
            </Link>

            {/* Desktop Navigation — centered; mega opens below full header */}
            <div className="hidden min-w-0 flex-1 justify-center px-2 lg:flex">
              <div className="flex max-w-full flex-nowrap items-center justify-center gap-0 py-0.5 xl:gap-0.5">
              <Link
                href="/"
                onMouseEnter={() => {
                  cancelCloseMenu();
                  setOpenSubmenu(null);
                }}
                className={[
                  desktopNavLinkBase,
                  active.isLinkActive("/") ? desktopNavLinkActive : desktopNavLinkInactive,
                ].join(" ")}
              >
                Home
              </Link>
              {NAV_ITEMS.map((item) => (
                <div key={item.name} className="relative">
                  {!hasMegaMenu(item) ? (
                    <Link
                      href={item.href}
                      onMouseEnter={() => {
                        cancelCloseMenu();
                        setOpenSubmenu(null);
                      }}
                      className={[
                        desktopNavLinkBase,
                        active.isLinkActive(item.href) ? desktopNavLinkActive : desktopNavLinkInactive,
                      ].join(" ")}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <div className="flex items-center">
                      {item.href === "#" ? (
                        <button
                          type="button"
                          id={`nav-mega-trigger-${item.name.replace(/\s+/g, "-").toLowerCase()}`}
                          onMouseEnter={(e: ReactMouseEvent<HTMLButtonElement>) => {
                            cancelCloseMenu();
                            setOpenSubmenu(item.name);
                            lastMegaTriggerRef.current = e.currentTarget;
                          }}
                          onFocus={(e: ReactFocusEvent<HTMLButtonElement>) => {
                            lastMegaTriggerRef.current = e.currentTarget;
                          }}
                          onClick={() => {
                            if (typeof window === "undefined") return;
                            if (!window.matchMedia("(hover: none)").matches) return;
                            setOpenSubmenu((prev) => (prev === item.name ? null : item.name));
                          }}
                          className={[
                            `${desktopNavLinkBase} inline-flex items-center gap-0.5`,
                            active.isItemActive(item) ? desktopNavLinkActive : desktopNavLinkInactive,
                          ].join(" ")}
                          aria-label={`Open ${item.name} menu`}
                          aria-haspopup="true"
                          aria-controls={MEGA_PANEL_ID}
                          aria-expanded={openSubmenu === item.name}
                        >
                          {item.name}
                          <ChevronDown
                            className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${
                              openSubmenu === item.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          id={`nav-mega-trigger-${item.name.replace(/\s+/g, "-").toLowerCase()}`}
                          onMouseEnter={(e: ReactMouseEvent<HTMLAnchorElement>) => {
                            cancelCloseMenu();
                            setOpenSubmenu(item.name);
                            lastMegaTriggerRef.current = e.currentTarget;
                          }}
                          onFocus={(e: ReactFocusEvent<HTMLAnchorElement>) => {
                            lastMegaTriggerRef.current = e.currentTarget;
                          }}
                          onClick={(e: ReactMouseEvent<HTMLAnchorElement>) => {
                            if (typeof window === "undefined") return;
                            if (!window.matchMedia("(hover: none)").matches) return;
                            if (openSubmenu !== item.name) {
                              e.preventDefault();
                              setOpenSubmenu(item.name);
                              lastMegaTriggerRef.current = e.currentTarget;
                            }
                          }}
                          className={[
                            `${desktopNavLinkBase} inline-flex items-center gap-0.5`,
                            active.isItemActive(item) ? desktopNavLinkActive : desktopNavLinkInactive,
                          ].join(" ")}
                          aria-haspopup="true"
                          aria-controls={MEGA_PANEL_ID}
                          aria-expanded={openSubmenu === item.name}
                        >
                          {item.name}
                          <ChevronDown
                            className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${
                              openSubmenu === item.name ? "rotate-180" : ""
                            }`}
                          />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ))}
              </div>
            </div>

            {/* Primary CTA (language + sign in live in SiteTopBar) */}
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <Link
                href="/publications"
                onMouseEnter={() => {
                  cancelCloseMenu();
                  setOpenSubmenu(null);
                }}
                className="inline-flex items-center rounded-full bg-acep-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-acep-primary/90"
              >
                Publications
              </Link>
            </div>

            <Link
              href="/publications"
              onMouseEnter={() => {
                cancelCloseMenu();
                setOpenSubmenu(null);
              }}
              className="inline-flex shrink-0 items-center rounded-full bg-acep-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-acep-primary/90 lg:hidden"
            >
              Publications
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2.5 text-slate-700 hover:bg-slate-100 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                  }`}
                />
                <X
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>

        {openMegaItem && (
          <div className="absolute left-0 right-0 top-full z-[100] hidden lg:block">
            <MegaMenuPanel
              id={MEGA_PANEL_ID}
              item={openMegaItem}
              onNavigate={() => setOpenSubmenu(null)}
              isLinkActive={active.isLinkActive}
            />
          </div>
        )}

        {/* Mobile menu with slide animation */}
        <div
          className={`lg:hidden overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 ${
            mobileMenuOpen ? "max-h-screen rounded-none opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-3 px-4 py-4">
            <div className="space-y-2">
            <Link
              href="/"
              className={[
                mobileNavLinkBase,
                active.isLinkActive("/")
                  ? "text-acep-primary bg-acep-primary/5"
                  : "text-slate-800 hover:bg-slate-50 hover:text-acep-primary",
              ].join(" ")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {NAV_ITEMS.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className={[
                      `flex-1 ${mobileNavLinkBase}`,
                      active.isItemActive(item)
                        ? "text-acep-primary bg-acep-primary/5"
                        : "text-slate-800 hover:bg-slate-50 hover:text-acep-primary",
                    ].join(" ")}
                    onClick={() => !hasMegaMenu(item) && setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {hasMegaMenu(item) && (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSubmenu(openSubmenu === item.name ? null : item.name)
                      }
                      className="p-3 text-slate-600"
                    >
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${
                          openSubmenu === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
                {hasMegaMenu(item) && (
                  <div
                    className={`ml-4 mt-1 space-y-1 border-l-2 border-slate-100 pl-4 overflow-hidden transition-all duration-300 ${
                      openSubmenu === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className={[
                          "block rounded-md px-4 py-2.5 text-sm transition-all duration-200",
                          active.isLinkActive(subitem.href)
                            ? "text-acep-primary bg-acep-primary/5 font-medium"
                            : "text-slate-600 hover:bg-slate-50 hover:text-acep-primary",
                        ].join(" ")}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setOpenSubmenu(null);
                        }}
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            </div>

            <div className="mt-2 border-t border-slate-200 pt-4">
              <Link
                href="/publications"
                className="block rounded-md bg-acep-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore Publications
              </Link>
            </div>
          </div>
        </div>
        </header>
        </div>
      </div>
    </>
  );
}
