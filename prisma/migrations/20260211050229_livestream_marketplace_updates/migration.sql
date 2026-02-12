/*
  Warnings:

  - You are about to drop the `MarketplaceFavorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarketplaceListing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MarketplaceFavorite" DROP CONSTRAINT "MarketplaceFavorite_listingId_fkey";

-- DropForeignKey
ALTER TABLE "MarketplaceFavorite" DROP CONSTRAINT "MarketplaceFavorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "MarketplaceListing" DROP CONSTRAINT "MarketplaceListing_sellerId_fkey";

-- DropTable
DROP TABLE "MarketplaceFavorite";

-- DropTable
DROP TABLE "MarketplaceListing";

-- DropEnum
DROP TYPE "ItemCondition";

-- DropEnum
DROP TYPE "ListingStatus";

-- DropEnum
DROP TYPE "MarketplaceCategory";
