import type { Metadata } from "next";
import { PortalForgotPasswordForm } from "@/components/portal/portal-forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password | ACEP participant portal",
};

export default function PortalForgotPasswordPage() {
  return <PortalForgotPasswordForm />;
}
