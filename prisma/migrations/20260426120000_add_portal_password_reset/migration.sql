-- CreateTable
CREATE TABLE "PortalPasswordReset" (
    "id" TEXT NOT NULL,
    "portalUserId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortalPasswordReset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PortalPasswordReset_tokenHash_key" ON "PortalPasswordReset"("tokenHash");

CREATE INDEX "PortalPasswordReset_portalUserId_idx" ON "PortalPasswordReset"("portalUserId");

CREATE INDEX "PortalPasswordReset_expiresAt_idx" ON "PortalPasswordReset"("expiresAt");

ALTER TABLE "PortalPasswordReset" ADD CONSTRAINT "PortalPasswordReset_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "PortalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
