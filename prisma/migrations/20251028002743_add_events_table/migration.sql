-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "banner" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_startDate_endDate_idx" ON "Event"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Alumni_graduationYear_idx" ON "Alumni"("graduationYear");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
