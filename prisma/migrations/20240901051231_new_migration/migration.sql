/*
  Warnings:

  - Made the column `favorite` on table `board` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `board` MODIFY `favorite` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `list` (
    `id` VARCHAR(191) NOT NULL,
    `boardId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    INDEX `list_boardId_idx`(`boardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `card` (
    `id` VARCHAR(191) NOT NULL,
    `columnId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL,
    `date` DATETIME(3) NULL,

    INDEX `card_columnId_idx`(`columnId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `cardId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `userImage` TEXT NOT NULL,
    `userName` TEXT NOT NULL,

    INDEX `Comment_cardId_idx`(`cardId`),
    INDEX `Comment_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `userId` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,

    INDEX `members_userId_idx`(`userId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cardMember` (
    `cardId` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,
    `memberDesignation` VARCHAR(191) NOT NULL,

    INDEX `cardMember_cardId_idx`(`cardId`),
    INDEX `cardMember_memberId_idx`(`memberId`),
    PRIMARY KEY (`cardId`, `memberId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `colorOnCard` (
    `id` VARCHAR(191) NOT NULL,
    `cardId` VARCHAR(191) NOT NULL,
    `color` ENUM('DARK_OLIVE_GREEN', 'FOREST_GREEN', 'DARK_SEA_GREEN', 'MOSS_GREEN', 'HUNTER_GREEN', 'DARK_PINK', 'DEEP_PINK', 'RASPBERRY', 'DARK_HOT_PINK', 'MAROON', 'INDIGO', 'EGGPLANT', 'PLUM', 'ROYAL_PURPLE', 'DARK_ORCHID', 'MIDNIGHT_BLUE', 'NAVY_BLUE', 'DARK_SLATE_BLUE', 'PRUSSIAN_BLUE', 'ROYAL_BLUE', 'DARK_RED', 'BURGUNDY', 'CRIMSON', 'FIREBRICK', 'BLOOD_RED', 'DARK_GOLDENROD', 'MUSTARD', 'OLIVE', 'KHAKI', 'BRONZE', 'DARK_CYAN', 'SLATE_GRAY', 'DEEP_SEA_BLUE', 'MAHOGANY', 'SADDLE_BROWN') NOT NULL,
    `name` VARCHAR(191) NULL,

    INDEX `colorOnCard_cardId_idx`(`cardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checklist` (
    `checkListId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `cardId` VARCHAR(191) NOT NULL,

    INDEX `checklist_cardId_idx`(`cardId`),
    PRIMARY KEY (`checkListId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `todo` (
    `todoId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `done` BOOLEAN NOT NULL,
    `checkListId` VARCHAR(191) NOT NULL,

    INDEX `todo_checkListId_idx`(`checkListId`),
    PRIMARY KEY (`todoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
