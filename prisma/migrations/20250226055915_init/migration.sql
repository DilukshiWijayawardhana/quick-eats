-- CreateTable
CREATE TABLE `customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customers_name_key`(`name`),
    UNIQUE INDEX `customers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mobile` VARCHAR(20) NOT NULL,
    `otp` VARCHAR(6) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shops` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ownerName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `nic` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `openTime` DATETIME(3) NULL,
    `closingTime` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `bankName` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NULL,
    `branch` VARCHAR(191) NULL,
    `accountHolderName` VARCHAR(191) NULL,
    `longitude` DOUBLE NULL,
    `latitude` DOUBLE NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shops_email_key`(`email`),
    UNIQUE INDEX `shops_mobile_key`(`mobile`),
    UNIQUE INDEX `shops_nic_key`(`nic`),
    UNIQUE INDEX `shops_name_key`(`name`),
    UNIQUE INDEX `shops_accountNumber_key`(`accountNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `price` FLOAT NOT NULL,
    `description` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `stock` INTEGER NOT NULL,
    `shop_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `shop_id`(`shop_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food_variants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `food_id` INTEGER NOT NULL,
    `size` VARCHAR(191) NULL,
    `spiciness` VARCHAR(191) NULL,
    `crust_type` VARCHAR(191) NULL,
    `sauce_type` VARCHAR(191) NULL,
    `meat_option` VARCHAR(191) NULL,
    `cooking_preference` VARCHAR(191) NULL,
    `sweetness_level` VARCHAR(191) NULL,
    `dressing_type` VARCHAR(191) NULL,
    `add_ons` VARCHAR(191) NULL,
    `allergy_consideration` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer` INTEGER NOT NULL,
    `shop` INTEGER NOT NULL,
    `totalPrice` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderProducts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `foodVariantId` INTEGER NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `price` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `foods` ADD CONSTRAINT `foods_shop_id_fkey` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `food_variants` ADD CONSTRAINT `food_variants_food_id_fkey` FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_customer_fkey` FOREIGN KEY (`customer`) REFERENCES `customers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_shop_fkey` FOREIGN KEY (`shop`) REFERENCES `shops`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OrderProducts` ADD CONSTRAINT `OrderProducts_order_fkey` FOREIGN KEY (`order`) REFERENCES `Orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderProducts` ADD CONSTRAINT `OrderProducts_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `foods`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OrderProducts` ADD CONSTRAINT `OrderProducts_foodVariantId_fkey` FOREIGN KEY (`foodVariantId`) REFERENCES `food_variants`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
