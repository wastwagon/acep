-- AlterTable Event
ALTER TABLE "Event" ADD COLUMN     "publicExhibitorRegistration" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxExhibitorRegistrations" INTEGER,
ADD COLUMN     "streamUrl" TEXT;

-- CreateTable
CREATE TABLE "EventExhibitorRegistration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "status" "EventRegistrationStatus" NOT NULL DEFAULT 'PENDING_EMAIL',
    "checkInCode" TEXT NOT NULL,
    "confirmationTokenHash" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "checkedInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventExhibitorRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSpeaker" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "title" TEXT,
    "bio" TEXT,
    "inviteTokenHash" TEXT NOT NULL,
    "lastInviteSentAt" TIMESTAMP(3),
    "firstOpenedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSpeaker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventExhibitorRegistration_checkInCode_key" ON "EventExhibitorRegistration"("checkInCode");

-- CreateIndex
CREATE UNIQUE INDEX "EventExhibitorRegistration_eventId_email_key" ON "EventExhibitorRegistration"("eventId", "email");

-- CreateIndex
CREATE INDEX "EventExhibitorRegistration_eventId_idx" ON "EventExhibitorRegistration"("eventId");

-- CreateIndex
CREATE INDEX "EventExhibitorRegistration_checkInCode_idx" ON "EventExhibitorRegistration"("checkInCode");

-- CreateIndex
CREATE INDEX "EventExhibitorRegistration_status_idx" ON "EventExhibitorRegistration"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EventSpeaker_inviteTokenHash_key" ON "EventSpeaker"("inviteTokenHash");

-- CreateIndex
CREATE INDEX "EventSpeaker_eventId_idx" ON "EventSpeaker"("eventId");

-- CreateIndex
CREATE INDEX "EventSpeaker_email_idx" ON "EventSpeaker"("email");

-- AddForeignKey
ALTER TABLE "EventExhibitorRegistration" ADD CONSTRAINT "EventExhibitorRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSpeaker" ADD CONSTRAINT "EventSpeaker_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
