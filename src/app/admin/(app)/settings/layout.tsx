import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · System",
  robots: { index: false, follow: false },
};

export default function AdminSettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
