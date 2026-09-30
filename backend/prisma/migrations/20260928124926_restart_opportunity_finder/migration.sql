/*
  Warnings:

  - You are about to drop the column `applicationStart` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `branches` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `degrees` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `educationLevels` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `eligibility` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `examDate` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `fees` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `lastVerified` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `opportunityType` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `requiredDocuments` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `resultDate` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `states` on the `Opportunity` table. All the data in the column will be lost.
  - Added the required column `type` to the `Opportunity` table without a default value. This is not possible if the table is not empty.
  - Made the column `organization` on table `Opportunity` required. This step will fail if there are existing NULL values in that column.

*/

-- Phase 2 restart: clear ONLY legacy Opportunity rows so required
-- columns (type, organization) can be applied safely.
-- Does NOT touch User or StudentProfile.
DELETE FROM "Opportunity";

-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('EXAM', 'SCHOLARSHIP', 'COURSE', 'INTERNSHIP', 'CERTIFICATION', 'COMPETITION', 'RESEARCH', 'FELLOWSHIP', 'CAREER_PROGRAM', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('UPCOMING', 'OPEN', 'CLOSING_SOON', 'CLOSED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Opportunity" DROP COLUMN "applicationStart",
DROP COLUMN "branches",
DROP COLUMN "category",
DROP COLUMN "degrees",
DROP COLUMN "educationLevels",
DROP COLUMN "eligibility",
DROP COLUMN "examDate",
DROP COLUMN "fees",
DROP COLUMN "isActive",
DROP COLUMN "lastVerified",
DROP COLUMN "opportunityType",
DROP COLUMN "requiredDocuments",
DROP COLUMN "resultDate",
DROP COLUMN "states",
ADD COLUMN     "applicationStartDate" TIMESTAMP(3),
ADD COLUMN     "isRemote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "status" "OpportunityStatus" NOT NULL DEFAULT 'UPCOMING',
ADD COLUMN     "type" "OpportunityType" NOT NULL,
ALTER COLUMN "organization" SET NOT NULL;

-- CreateTable
CREATE TABLE "ExamDetails" (
    "id" SERIAL NOT NULL,
    "opportunityId" INTEGER NOT NULL,
    "examDate" TIMESTAMP(3),
    "examMode" TEXT,
    "conductingBody" TEXT,
    "applicationFee" TEXT,
    "ageLimit" TEXT,
    "numberOfAttempts" TEXT,
    "eligibilityText" TEXT,
    "syllabusUrl" TEXT,
    "notificationUrl" TEXT,

    CONSTRAINT "ExamDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipDetails" (
    "id" SERIAL NOT NULL,
    "opportunityId" INTEGER NOT NULL,
    "awardAmount" TEXT,
    "awardType" TEXT,
    "incomeLimit" TEXT,
    "academicRequirement" TEXT,
    "categoryRequirement" TEXT,
    "benefits" TEXT,
    "requiredDocuments" TEXT,

    CONSTRAINT "ScholarshipDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseDetails" (
    "id" SERIAL NOT NULL,
    "opportunityId" INTEGER NOT NULL,
    "duration" TEXT,
    "level" TEXT,
    "mode" TEXT,
    "price" TEXT,
    "rating" DOUBLE PRECISION,
    "certificate" BOOLEAN NOT NULL DEFAULT false,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "startDate" TIMESTAMP(3),

    CONSTRAINT "CourseDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionDetails" (
    "id" SERIAL NOT NULL,
    "opportunityId" INTEGER NOT NULL,
    "competitionDate" TIMESTAMP(3),
    "registrationDeadline" TIMESTAMP(3),
    "teamBased" BOOLEAN NOT NULL DEFAULT false,
    "teamSize" TEXT,
    "prizeDetails" TEXT,
    "participationMode" TEXT,
    "themes" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "CompetitionDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchDetails" (
    "id" SERIAL NOT NULL,
    "opportunityId" INTEGER NOT NULL,
    "researchArea" TEXT,
    "duration" TEXT,
    "stipend" TEXT,
    "facultyRequired" BOOLEAN NOT NULL DEFAULT false,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "eligibilityText" TEXT,

    CONSTRAINT "ResearchDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FellowshipDetails" (
    "id" SERIAL NOT NULL,
    "opportunityId" INTEGER NOT NULL,
    "duration" TEXT,
    "stipend" TEXT,
    "fellowshipAmount" TEXT,
    "eligibilityText" TEXT,
    "benefits" TEXT,

    CONSTRAINT "FellowshipDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternshipDetails" (
    "id" SERIAL NOT NULL,
    "opportunityId" INTEGER NOT NULL,
    "role" TEXT,
    "duration" TEXT,
    "stipend" TEXT,
    "workMode" TEXT,
    "experienceLevel" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "startDate" TIMESTAMP(3),

    CONSTRAINT "InternshipDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificationDetails" (
    "id" SERIAL NOT NULL,
    "opportunityId" INTEGER NOT NULL,
    "provider" TEXT,
    "level" TEXT,
    "duration" TEXT,
    "price" TEXT,
    "certificateType" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "CertificationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamDetails_opportunityId_key" ON "ExamDetails"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "ScholarshipDetails_opportunityId_key" ON "ScholarshipDetails"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseDetails_opportunityId_key" ON "CourseDetails"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionDetails_opportunityId_key" ON "CompetitionDetails"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchDetails_opportunityId_key" ON "ResearchDetails"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "FellowshipDetails_opportunityId_key" ON "FellowshipDetails"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "InternshipDetails_opportunityId_key" ON "InternshipDetails"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "CertificationDetails_opportunityId_key" ON "CertificationDetails"("opportunityId");

-- CreateIndex
CREATE INDEX "Opportunity_type_idx" ON "Opportunity"("type");

-- CreateIndex
CREATE INDEX "Opportunity_status_idx" ON "Opportunity"("status");

-- CreateIndex
CREATE INDEX "Opportunity_applicationDeadline_idx" ON "Opportunity"("applicationDeadline");

-- CreateIndex
CREATE INDEX "Opportunity_organization_idx" ON "Opportunity"("organization");

-- AddForeignKey
ALTER TABLE "ExamDetails" ADD CONSTRAINT "ExamDetails_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipDetails" ADD CONSTRAINT "ScholarshipDetails_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseDetails" ADD CONSTRAINT "CourseDetails_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionDetails" ADD CONSTRAINT "CompetitionDetails_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchDetails" ADD CONSTRAINT "ResearchDetails_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FellowshipDetails" ADD CONSTRAINT "FellowshipDetails_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipDetails" ADD CONSTRAINT "InternshipDetails_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificationDetails" ADD CONSTRAINT "CertificationDetails_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
