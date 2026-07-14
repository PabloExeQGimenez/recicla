/*
  Warnings:

  - A unique constraint covering the columns `[dni]` on the table `Recuperador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cuil]` on the table `Recuperador` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PesajeStatus" AS ENUM ('PENDING', 'PAYMENT_REQUESTED', 'PAID');

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currentPrice" DECIMAL(10,2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pesaje" (
    "id" TEXT NOT NULL,
    "recuperadorId" TEXT NOT NULL,
    "status" "PesajeStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pesaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PesajeItem" (
    "id" TEXT NOT NULL,
    "pesajeId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "weight" DECIMAL(10,2) NOT NULL,
    "pricePerKgAtMoment" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "PesajeItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Recuperador_dni_key" ON "Recuperador"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Recuperador_cuil_key" ON "Recuperador"("cuil");

-- AddForeignKey
ALTER TABLE "Pesaje" ADD CONSTRAINT "Pesaje_recuperadorId_fkey" FOREIGN KEY ("recuperadorId") REFERENCES "Recuperador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesajeItem" ADD CONSTRAINT "PesajeItem_pesajeId_fkey" FOREIGN KEY ("pesajeId") REFERENCES "Pesaje"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesajeItem" ADD CONSTRAINT "PesajeItem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
