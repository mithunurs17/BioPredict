-- CreateTable
CREATE TABLE "BiomarkerRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fluidType" TEXT NOT NULL,
    "biomarkers" JSONB NOT NULL,
    "predictions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiomarkerRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BiomarkerRecord" ADD CONSTRAINT "BiomarkerRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
