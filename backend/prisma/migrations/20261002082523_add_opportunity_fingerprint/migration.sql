/*
  Warnings:

  - A unique constraint covering the columns `[fingerprint]` on the table `Opportunity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "fingerprint" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Opportunity_fingerprint_key" ON "Opportunity"("fingerprint");
