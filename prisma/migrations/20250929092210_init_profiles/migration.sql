-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('student', 'faculty', 'alumni');

-- CreateEnum
CREATE TYPE "public"."ClassYear" AS ENUM ('freshman', 'sophomore', 'junior', 'senior');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hashed" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "profilePicture" TEXT,
    "bio" TEXT,
    "userType" "public"."UserType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "city" TEXT,
    "websites" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "userId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "minor" TEXT,
    "year" "public"."ClassYear" NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "gpa" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "public"."Faculty" (
    "userId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "officeLocation" TEXT NOT NULL,
    "OfficeHours" TEXT NOT NULL,
    "researchInterests" TEXT,
    "sections" TEXT[]
);

-- CreateTable
CREATE TABLE "public"."Alumni" (
    "userId" TEXT NOT NULL,
    "gradutationYear" INTEGER NOT NULL,
    "degree" TEXT NOT NULL,
    "currentCompany" TEXT,
    "currentPostion" TEXT,
    "industry" TEXT,
    "isMentor" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "public"."ConnectionRequest" (
    "id" TEXT NOT NULL,
    "sendId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_UserConnections" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserConnections_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "public"."Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentId_key" ON "public"."Student"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_userId_key" ON "public"."Faculty"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_employeeId_key" ON "public"."Faculty"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_userId_key" ON "public"."Alumni"("userId");

-- CreateIndex
CREATE INDEX "ConnectionRequest_sendId_idx" ON "public"."ConnectionRequest"("sendId");

-- CreateIndex
CREATE INDEX "ConnectionRequest_receiverId_idx" ON "public"."ConnectionRequest"("receiverId");

-- CreateIndex
CREATE INDEX "ConnectionRequest_status_idx" ON "public"."ConnectionRequest"("status");

-- CreateIndex
CREATE INDEX "_UserConnections_B_index" ON "public"."_UserConnections"("B");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Faculty" ADD CONSTRAINT "Faculty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Alumni" ADD CONSTRAINT "Alumni_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_sendId_fkey" FOREIGN KEY ("sendId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserConnections" ADD CONSTRAINT "_UserConnections_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserConnections" ADD CONSTRAINT "_UserConnections_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
