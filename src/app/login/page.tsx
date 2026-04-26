import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentCmsUser } from "@/lib/cms-auth";
import { getCurrentPortalUser } from "@/lib/portal-auth";
import { UnifiedLoginForm } from "@/components/auth/unified-login-form";

export const metadata: Metadata = {
  title: "Sign in | ACEP",
  description: "Sign in to the CMS admin dashboard or the participant portal.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const [cms, portal] = await Promise.all([getCurrentCmsUser(), getCurrentPortalUser()]);
  if (cms) redirect("/admin");
  if (portal) redirect("/portal");

  const sp = await searchParams;
  const from = sp.from === "admin" || sp.from === "portal" ? sp.from : undefined;

  return <UnifiedLoginForm fromHint={from} />;
}
