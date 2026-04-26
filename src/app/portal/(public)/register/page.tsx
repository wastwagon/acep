import type { Metadata } from "next";
import { PortalRegisterForm } from "@/components/portal/portal-register-form";

export const metadata: Metadata = {
  title: "Create participant account | ACEP",
  description: "Register for the participant portal with your event email.",
};

export default function PortalRegisterPage() {
  return <PortalRegisterForm />;
}
