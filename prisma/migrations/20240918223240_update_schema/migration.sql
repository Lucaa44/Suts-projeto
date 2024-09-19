/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cnpj` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "cnpj" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_cnpj_key" ON "Hospital"("cnpj");
