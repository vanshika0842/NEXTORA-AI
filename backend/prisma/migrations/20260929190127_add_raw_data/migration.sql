-- CreateTable
CREATE TABLE "RawData" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "contentType" TEXT,
    "statusCode" INTEGER,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RawData_sourceId_idx" ON "RawData"("sourceId");

-- CreateIndex
CREATE INDEX "RawData_collectedAt_idx" ON "RawData"("collectedAt");

-- AddForeignKey
ALTER TABLE "RawData" ADD CONSTRAINT "RawData_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
