/*
  Warnings:

  - Added the required column `password` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "password" TEXT NOT NULL;
