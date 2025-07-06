/*
  Warnings:
  - You are about to drop the `book` table. If the table is not empty, all the data it contains will be lost.
*/

-- 1. FIRST drop the Page's foreign key constraint
ALTER TABLE `Page` DROP FOREIGN KEY `Page_bookId_fkey`;

-- 2. THEN drop the index (now safe)
DROP INDEX `Page_bookId_fkey` ON `Page`;

-- 3. Now safely drop the book table's foreign key
ALTER TABLE `book` DROP FOREIGN KEY `Book_userId_fkey`;

-- 4. Finally drop the table
DROP TABLE `book`;

-- 5. Create new Book table (uppercase B)
CREATE TABLE `Book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6. Recreate all foreign keys
ALTER TABLE `Book` ADD CONSTRAINT `Book_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Page` ADD CONSTRAINT `Page_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;