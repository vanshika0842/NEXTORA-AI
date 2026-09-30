-- CreateTable
CREATE TABLE "SourceConfiguration" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "requestConfig" JSONB,
    "parsingConfig" JSONB,
    "monitoringConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SourceConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SourceConfiguration_sourceId_key" ON "SourceConfiguration"("sourceId");

-- AddForeignKey
ALTER TABLE "SourceConfiguration" ADD CONSTRAINT "SourceConfiguration_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
