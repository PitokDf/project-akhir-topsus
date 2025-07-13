/*
  Warnings:

  - A unique constraint covering the columns `[payment_token]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[payment_url]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "payment_token" TEXT,
ADD COLUMN     "payment_url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_payment_token_key" ON "transactions"("payment_token");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_payment_url_key" ON "transactions"("payment_url");
