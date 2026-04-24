"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { displaySerif } from "@/lib/display-serif";
import { ErrorFallbackUI } from "@/components/shared/error-fallback-ui";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

/**
 * Renders when the root layout throws. Must include its own `html` / `body`
 * (see Next.js docs: global-error).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${inter.variable} ${displaySerif.variable}`}>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <ErrorFallbackUI
          layout="fullscreen"
          kicker="Application error"
          title="ACEP could not start this view"
          description="Something failed at the site shell level. Reload the page or use the links below."
          digest={error.digest}
          onReset={() => reset()}
        />
      </body>
    </html>
  );
}
