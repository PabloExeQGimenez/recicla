-- CreateEnum
CREATE TYPE "SolicitudPagoStatus" AS ENUM ('PENDING', 'PAID');

-- AlterTable
ALTER TABLE "Pesaje" ADD COLUMN     "solicitudPagoId" TEXT;

-- CreateTable
CREATE TABLE "SolicitudPago" (
    "id" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "status" "SolicitudPagoStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SolicitudPago_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pesaje" ADD CONSTRAINT "Pesaje_solicitudPagoId_fkey" FOREIGN KEY ("solicitudPagoId") REFERENCES "SolicitudPago"("id") ON DELETE SET NULL ON UPDATE CASCADE;
