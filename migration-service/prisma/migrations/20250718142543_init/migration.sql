/*
  Warnings:

  - The primary key for the `menus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `transaction_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `price_at_sale` on the `transaction_items` table. All the data in the column will be lost.
  - The primary key for the `transactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `payment_token` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `payment_url` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payment_gateway_id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `total_amount` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transaction_items" DROP CONSTRAINT "transaction_items_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction_items" DROP CONSTRAINT "transaction_items_transaction_id_fkey";

-- DropIndex
DROP INDEX "transactions_payment_token_key";

-- DropIndex
DROP INDEX "transactions_payment_url_key";

-- AlterTable
ALTER TABLE "menus" DROP CONSTRAINT "menus_pkey",
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "menus_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "menus_id_seq";

-- AlterTable
ALTER TABLE "transaction_items" DROP CONSTRAINT "transaction_items_pkey",
DROP COLUMN "price_at_sale",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "transaction_id" SET DATA TYPE TEXT,
ALTER COLUMN "menu_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "transaction_items_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "transaction_items_id_seq";

-- AlterTable
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_pkey",
DROP COLUMN "payment_token",
DROP COLUMN "payment_url",
DROP COLUMN "totalAmount",
ADD COLUMN     "payment_gateway_id" TEXT,
ADD COLUMN     "payment_gateway_url" TEXT,
ADD COLUMN     "total_amount" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "payment_method" DROP DEFAULT,
ALTER COLUMN "status" DROP DEFAULT,
ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "transactions_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "transactions_payment_gateway_id_key" ON "transactions"("payment_gateway_id");

-- AddForeignKey
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
