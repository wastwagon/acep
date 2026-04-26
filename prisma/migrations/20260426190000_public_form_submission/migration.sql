-- CreateEnum
CREATE TYPE "PublicFormKind" AS ENUM ('ELECTRICITY_COMPLAINT', 'TAX_WHISTLEBLOWER');

-- CreateTable
CREATE TABLE "PublicFormSubmission" (
    "id" TEXT NOT NULL,
    "kind" "PublicFormKind" NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicFormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublicFormSubmission_kind_createdAt_idx" ON "PublicFormSubmission"("kind", "createdAt");
