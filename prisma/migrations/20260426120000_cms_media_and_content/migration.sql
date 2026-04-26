-- CreateEnum
CREATE TYPE "CmsMediaKind" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'ARCHIVE', 'OTHER');

-- CreateTable
CREATE TABLE "CmsMedia" (
    "id" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "storageFile" TEXT NOT NULL,
    "publicPath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "kind" "CmsMediaKind" NOT NULL DEFAULT 'OTHER',
    "width" INTEGER,
    "height" INTEGER,
    "uploaderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsContentEntry" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "groupKey" TEXT NOT NULL DEFAULT 'site',
    "description" TEXT,
    "value" TEXT NOT NULL DEFAULT '',
    "valueType" TEXT NOT NULL DEFAULT 'text',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsContentEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CmsMedia_storageFile_key" ON "CmsMedia"("storageFile");

-- CreateIndex
CREATE INDEX "CmsMedia_kind_idx" ON "CmsMedia"("kind");

-- CreateIndex
CREATE INDEX "CmsMedia_createdAt_idx" ON "CmsMedia"("createdAt");

-- CreateIndex
CREATE INDEX "CmsMedia_uploaderId_idx" ON "CmsMedia"("uploaderId");

-- CreateIndex
CREATE UNIQUE INDEX "CmsContentEntry_key_key" ON "CmsContentEntry"("key");

-- CreateIndex
CREATE INDEX "CmsContentEntry_groupKey_idx" ON "CmsContentEntry"("groupKey");

-- CreateIndex
CREATE INDEX "CmsContentEntry_sortOrder_idx" ON "CmsContentEntry"("sortOrder");

-- AddForeignKey
ALTER TABLE "CmsMedia" ADD CONSTRAINT "CmsMedia_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "CmsUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsContentEntry" ADD CONSTRAINT "CmsContentEntry_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "CmsUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
