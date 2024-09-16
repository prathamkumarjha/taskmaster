/*
  Warnings:

  - You are about to drop the column `message` on the `audit_log` table. All the data in the column will be lost.
  - Added the required column `action` to the `AUDIT_LOG` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `audit_log` DROP COLUMN `message`,
    ADD COLUMN `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'MOVED') NOT NULL;
