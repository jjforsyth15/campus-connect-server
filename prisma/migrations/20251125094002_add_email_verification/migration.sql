-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationToken" TEXT,
ADD COLUMN     "verificationTokenExpiration" TIMESTAMP(3);
