import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin · Database",
  robots: { index: false, follow: false },
};

export default function AdminSettingsLayout({ children }: { children: React.ReactNode }) {
  void prisma;
  return <>{children}</>;
}
