-- CreateTable
CREATE TABLE "CmsMarketingPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "intro" TEXT NOT NULL DEFAULT '',
    "bodyHtml" TEXT NOT NULL DEFAULT '',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsMarketingPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CmsMarketingPage_slug_key" ON "CmsMarketingPage"("slug");

-- CreateIndex
CREATE INDEX "CmsMarketingPage_updatedAt_idx" ON "CmsMarketingPage"("updatedAt");

-- AddForeignKey
ALTER TABLE "CmsMarketingPage" ADD CONSTRAINT "CmsMarketingPage_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "CmsUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
