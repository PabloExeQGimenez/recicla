-- DropForeignKey
ALTER TABLE "PesajeItem" DROP CONSTRAINT "PesajeItem_pesajeId_fkey";

-- AddForeignKey
ALTER TABLE "PesajeItem" ADD CONSTRAINT "PesajeItem_pesajeId_fkey" FOREIGN KEY ("pesajeId") REFERENCES "Pesaje"("id") ON DELETE CASCADE ON UPDATE CASCADE;
