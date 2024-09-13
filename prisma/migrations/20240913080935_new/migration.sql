/*
  Warnings:

  - You are about to alter the column `color` on the `coloroncard` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `coloroncard` MODIFY `color` VARCHAR(191) NOT NULL;
