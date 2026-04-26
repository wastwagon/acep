-- CreateTable
CREATE TABLE "CmsMarketingHub" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "intro" TEXT NOT NULL DEFAULT '',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsMarketingHub_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CmsMarketingHub_slug_key" ON "CmsMarketingHub"("slug");

-- CreateIndex
CREATE INDEX "CmsMarketingHub_updatedAt_idx" ON "CmsMarketingHub"("updatedAt");

-- AddForeignKey
ALTER TABLE "CmsMarketingHub" ADD CONSTRAINT "CmsMarketingHub_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "CmsUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
