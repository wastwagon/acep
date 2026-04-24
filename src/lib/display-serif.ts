import { Source_Serif_4 } from "next/font/google";

/**
 * Editorial serif — hero + major headings.
 * `variable` exposes `--font-display-serif` for Tailwind `font-display`.
 */
export const displaySerif = Source_Serif_4({
  weight: ["500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-serif",
});
