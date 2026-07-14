-- DropForeignKey
ALTER TABLE "PesajeItem" DROP CONSTRAINT "PesajeItem_materialId_fkey";

-- AddForeignKey
ALTER TABLE "PesajeItem" ADD CONSTRAINT "PesajeItem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
