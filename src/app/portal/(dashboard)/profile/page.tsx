import { requirePortalUser } from "@/lib/portal-auth";
import { PortalProfileForm } from "@/components/portal/portal-profile-form";

export const dynamic = "force-dynamic";

export default async function PortalProfilePage() {
  const user = await requirePortalUser();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Profile</h1>
        <p className="mt-1 text-sm text-slate-600">Update how you appear in the portal. Speaker display names sync to programme data.</p>
      </div>
      <PortalProfileForm
        initial={{
          displayName: user.displayName,
          phone: user.phone,
          organisation: user.organisation,
          bio: user.bio,
        }}
      />
    </div>
  );
}
