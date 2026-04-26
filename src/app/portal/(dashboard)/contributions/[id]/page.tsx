import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePortalUser } from "@/lib/portal-auth";
import { PortalEditContributionForm } from "@/components/portal/portal-edit-contribution-form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function PortalEditContributionPage({ params }: Props) {
  const user = await requirePortalUser();
  const { id } = await params;

  const c = await prisma.eventContribution.findFirst({
    where: { id, portalUserId: user.id },
    include: { event: { select: { title: true } } },
  });
  if (!c) notFound();
  const canEdit = c.status === "DRAFT" || (c.status === "SUBMITTED" && c.moderationStatus === "REJECTED");
  if (!canEdit) {
    redirect("/portal/contributions");
  }

  return (
    <div className="space-y-6">
      <PortalEditContributionForm
        initial={{
          id: c.id,
          title: c.title,
          body: c.body,
          eventTitle: c.event.title,
          editMode: c.status === "DRAFT" ? "draft" : "rejected",
        }}
      />
    </div>
  );
}
