-- AlterTable: Add name, lastName, dni to User table
ALTER TABLE "User" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "User" ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "User" ADD COLUMN "dni" TEXT;

-- CreateIndex for unique dni
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");
