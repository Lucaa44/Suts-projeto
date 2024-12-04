-- CreateTable
CREATE TABLE "PendingDonation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "vacancyId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingDonation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PendingDonation" ADD CONSTRAINT "PendingDonation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingDonation" ADD CONSTRAINT "PendingDonation_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
