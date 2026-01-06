/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_CategoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "ImageFile" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
