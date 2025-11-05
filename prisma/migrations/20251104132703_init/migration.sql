-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "ImageFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "ImageFile" TEXT NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "Description" TEXT NOT NULL,
    "Inventory" INTEGER NOT NULL,
    "CategoryId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
