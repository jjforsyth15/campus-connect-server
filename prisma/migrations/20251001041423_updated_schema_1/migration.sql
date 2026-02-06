/*
  Warnings:

  - You are about to drop the column `currentPostion` on the `Alumni` table. All the data in the column will be lost.
  - You are about to drop the column `gradutationYear` on the `Alumni` table. All the data in the column will be lost.
  - You are about to drop the column `OfficeHours` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `password_hashed` on the `User` table. All the data in the column will be lost.
  - Added the required column `graduationYear` to the `Alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officeHours` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHashed` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Alumni" DROP CONSTRAINT "Alumni_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ConnectionRequest" DROP CONSTRAINT "ConnectionRequest_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Faculty" DROP CONSTRAINT "Faculty_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_userId_fkey";

-- AlterTable
ALTER TABLE "Alumni" DROP COLUMN "currentPostion",
DROP COLUMN "gradutationYear",
ADD COLUMN     "currentPosition" TEXT,
ADD COLUMN     "graduationYear" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "OfficeHours",
ADD COLUMN     "officeHours" TEXT NOT NULL,
ALTER COLUMN "sections" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password_hashed",
ADD COLUMN     "passwordHashed" TEXT NOT NULL,
ALTER COLUMN "websites" SET DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Student_graduationYear_idx" ON "Student"("graduationYear");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alumni" ADD CONSTRAINT "Alumni_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
