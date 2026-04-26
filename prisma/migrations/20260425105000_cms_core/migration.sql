-- CreateEnum
CREATE TYPE "CmsRole" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "CmsPostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "CmsUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "CmsRole" NOT NULL DEFAULT 'EDITOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CmsSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "status" "CmsPostStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CmsUser_email_key" ON "CmsUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CmsSession_tokenHash_key" ON "CmsSession"("tokenHash");

-- CreateIndex
CREATE INDEX "CmsSession_userId_idx" ON "CmsSession"("userId");

-- CreateIndex
CREATE INDEX "CmsSession_expiresAt_idx" ON "CmsSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "CmsPost_slug_key" ON "CmsPost"("slug");

-- CreateIndex
CREATE INDEX "CmsPost_status_idx" ON "CmsPost"("status");

-- CreateIndex
CREATE INDEX "CmsPost_publishedAt_idx" ON "CmsPost"("publishedAt");

-- CreateIndex
CREATE INDEX "CmsPost_createdAt_idx" ON "CmsPost"("createdAt");

-- AddForeignKey
ALTER TABLE "CmsSession" ADD CONSTRAINT "CmsSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CmsUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsPost" ADD CONSTRAINT "CmsPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "CmsUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
