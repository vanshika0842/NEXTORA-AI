/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `researchFocus` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `stream` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_userId_fkey";

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "dateOfBirth",
DROP COLUMN "researchFocus",
DROP COLUMN "stream",
ADD COLUMN     "academicInterests" TEXT,
ADD COLUMN     "academicScore" TEXT,
ADD COLUMN     "academicScoreType" TEXT,
ADD COLUMN     "backlogs" INTEGER,
ADD COLUMN     "careerGoals" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "currentSemester" INTEGER,
ADD COLUMN     "currentYear" INTEGER,
ADD COLUMN     "degreeLevel" TEXT,
ADD COLUMN     "employmentStatus" TEXT,
ADD COLUMN     "expectedCompletionYear" INTEGER,
ADD COLUMN     "expectedGraduationYear" INTEGER,
ADD COLUMN     "highestQualification" TEXT,
ADD COLUMN     "institutionName" TEXT,
ADD COLUMN     "institutionType" TEXT,
ADD COLUMN     "schoolBoard" TEXT,
ADD COLUMN     "schoolClass" TEXT,
ADD COLUMN     "schoolStream" TEXT,
ADD COLUMN     "schoolSubjects" JSONB,
ADD COLUMN     "workExperience" TEXT;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
