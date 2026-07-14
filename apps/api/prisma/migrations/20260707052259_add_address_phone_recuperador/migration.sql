/*
  Warnings:

  - Added the required column `address` to the `Recuperador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Recuperador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recuperador" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
