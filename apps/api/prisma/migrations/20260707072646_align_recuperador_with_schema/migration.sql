-- AlterTable
ALTER TABLE "Recuperador" ADD COLUMN     "account" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "program" TEXT,
ADD COLUMN     "route" TEXT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;
