/*
  Warnings:

  - A unique constraint covering the columns `[mobile]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `customers_mobile_key` ON `customers`(`mobile`);
