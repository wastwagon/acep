import type { Metadata } from "next";
import { Suspense } from "react";
import { PortalResetPasswordInner } from "@/components/portal/portal-reset-password-inner";

export const metadata: Metadata = {
  title: "Reset password | ACEP participant portal",
};

export default function PortalResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-center text-sm text-slate-600">Loading…</p>}>
      <PortalResetPasswordInner />
    </Suspense>
  );
}
