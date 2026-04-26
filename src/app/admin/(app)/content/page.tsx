import { redirect } from "next/navigation";

/** @deprecated Use /admin/website — unified public-site editor. */
export default function AdminContentRedirectPage() {
  redirect("/admin/website");
}
