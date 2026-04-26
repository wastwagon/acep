"use client";

import { useSearchParams } from "next/navigation";
import { PortalResetPasswordForm } from "@/components/portal/portal-reset-password-form";

export function PortalResetPasswordInner() {
  const sp = useSearchParams();
  const token = sp.get("token") || "";
  return <PortalResetPasswordForm token={token} />;
}
