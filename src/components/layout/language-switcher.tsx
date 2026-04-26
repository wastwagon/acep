"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { ChevronDown, Globe } from "lucide-react";

const LOCALES = [
  { code: "en", flag: "🇬🇧", native: "English", english: "English" },
  { code: "fr", flag: "🇫🇷", native: "Français", english: "French" },
  { code: "pt", flag: "🇵🇹", native: "Português", english: "Portuguese" },
  { code: "ar", flag: "🇸🇦", native: "العربية", english: "Arabic" },
] as const;

type LocaleCode = (typeof LOCALES)[number]["code"];

const STORAGE_KEY = "acep-locale";

const VALID = new Set<string>(LOCALES.map((l) => l.code));

function readStored(): LocaleCode {
  if (typeof window === "undefined") return "en";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw && VALID.has(raw)) return raw as LocaleCode;
  return "en";
}

type LanguageSwitcherProps = {
  variant?: "toolbar" | "drawer";
};

export function LanguageSwitcher({ variant = "toolbar" }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<LocaleCode>("en");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startTransition(() => {
      setLocale(readStored());
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function select(code: LocaleCode) {
    setLocale(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore quota */
    }
    setOpen(false);
    window.dispatchEvent(new CustomEvent<LocaleCode>("acep:locale", { detail: code }));
  }

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  if (variant === "drawer") {
    return (
      <div ref={rootRef} className="rounded-acepCard border border-slate-200 bg-slate-50/80 p-2">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Language</p>
        <div className="grid grid-cols-2 gap-2">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => select(l.code)}
              className={`flex flex-col items-center gap-1 rounded-acepBtn border px-2 py-3 text-center transition ${
                locale === l.code
                  ? "border-slate-200 bg-white shadow-sm ring-1 ring-slate-200"
                  : "border-transparent bg-white/60 hover:border-slate-200 hover:bg-white"
              }`}
            >
              <span className="text-2xl leading-none" aria-hidden>
                {l.flag}
              </span>
              <span className="text-xs font-semibold text-slate-900">{l.english}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const triggerClass =
    "inline-flex h-10 items-center gap-2 rounded-acepBtn border border-slate-200/90 bg-white px-3.5 pl-3 text-[13px] font-semibold text-slate-900 shadow-sm transition hover:border-acep-primary/30 hover:bg-slate-50";

  const globeClass = "text-acep-primary";
  const chevronClass = "text-slate-500";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={triggerClass}
        title="Sets page language and reading direction for accessibility. Site content remains in English until translations are available."
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.english}. Change language`}
      >
        <Globe className={`h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${globeClass}`} strokeWidth={1.75} aria-hidden />
        <span className="max-w-[5.5rem] truncate sm:max-w-[9rem]">{current.native}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition sm:h-4 sm:w-4 ${chevronClass} ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-full z-[80] mt-2 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-acepCard border border-slate-200/95 bg-white p-2 shadow-[0_24px_64px_-20px_rgba(15,23,42,0.35)] animate-in fade-in slide-in-from-top-1 duration-200 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:duration-0"
        >
          {LOCALES.map((l) => {
            const selected = locale === l.code;
            return (
              <li key={l.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => select(l.code)}
                  className={`flex w-full items-start gap-3 rounded-acepBtn px-3 py-2.5 text-left transition ${
                    selected ? "bg-slate-100" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="pt-0.5 text-2xl leading-none" aria-hidden>
                    {l.flag}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900" dir={l.code === "ar" ? "rtl" : "ltr"}>
                      {l.native}
                    </span>
                    <span className="mt-0.5 block text-xs font-medium text-slate-500">{l.english}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
