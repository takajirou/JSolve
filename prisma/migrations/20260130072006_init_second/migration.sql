/*
  Warnings:

  - Added the required column `functionName` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webUsage` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Problem` ADD COLUMN `functionName` VARCHAR(191) NOT NULL,
    ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `section` VARCHAR(191) NULL,
    ADD COLUMN `webUsage` ENUM('NONE', 'LOW', 'DANGEROUS') NOT NULL;

-- CreateTable
CREATE TABLE `FunctionTutorial` (
    `id` VARCHAR(191) NOT NULL,
    `problemId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FunctionTutorial_problemId_key`(`problemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TutorialStep` (
    `id` VARCHAR(191) NOT NULL,
    `tutorialId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `code` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TutorialStep_tutorialId_idx`(`tutorialId`),
    INDEX `TutorialStep_order_idx`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Problem_webUsage_idx` ON `Problem`(`webUsage`);

-- CreateIndex
CREATE INDEX `Problem_section_idx` ON `Problem`(`section`);

-- CreateIndex
CREATE INDEX `Problem_order_idx` ON `Problem`(`order`);

-- AddForeignKey
ALTER TABLE `FunctionTutorial` ADD CONSTRAINT `FunctionTutorial_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TutorialStep` ADD CONSTRAINT `TutorialStep_tutorialId_fkey` FOREIGN KEY (`tutorialId`) REFERENCES `FunctionTutorial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
