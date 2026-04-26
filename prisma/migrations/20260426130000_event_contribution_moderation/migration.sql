-- CreateEnum
CREATE TYPE "EventContributionModeration" AS ENUM ('NONE', 'PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "EventContribution" ADD COLUMN     "moderationStatus" "EventContributionModeration" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT;

-- data backfill: submitted items go to review queue
UPDATE "EventContribution" SET "moderationStatus" = 'PENDING' WHERE "status" = 'SUBMITTED' AND "moderationStatus" = 'NONE';

CREATE INDEX "EventContribution_eventId_moderationStatus_idx" ON "EventContribution"("eventId", "moderationStatus");

ALTER TABLE "EventContribution" ADD CONSTRAINT "EventContribution_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "CmsUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
