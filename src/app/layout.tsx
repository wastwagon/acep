import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { displaySerif } from "@/lib/display-serif";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ACEP - Africa Centre for Energy Policy",
  description: "Promoting transparency in Ghana's energy and extractive sector governance. Oil & Gas, Power, Mining, Fiscal Governance, Climate Change & Energy Transition.",
  keywords: ["ACEP", "Ghana", "Energy Policy", "Oil Revenue", "Electricity", "Petroleum Contracts", "Resource Governance"],
  authors: [{ name: "Africa Centre for Energy Policy" }],
  openGraph: {
    title: "ACEP - Africa Centre for Energy Policy",
    description: "An Africa in which energy & extractive resources are utilised for economic transformation & sustainable inclusive development.",
    url: "https://acep.africa",
    siteName: "ACEP",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${displaySerif.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <a
          href="#site-main"
          className="fixed left-4 top-0 z-[100] -translate-y-full rounded-acepBtn bg-acep-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition motion-reduce:transition-none focus-visible:top-4 focus-visible:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acep-secondary focus-visible:ring-offset-2"
        >
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <Header />
          {/* Reserves space for fixed header bar (hero on home overlaps via negative margin) */}
          <div
            aria-hidden
            className="pointer-events-none h-[6.5rem] shrink-0 lg:h-[6.75rem]"
          />
          <main id="site-main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
