-- AlterTable
ALTER TABLE `audit_log` MODIFY `entityType` ENUM('BOARD', 'LIST', 'CARD', 'CHECKLIST') NOT NULL;
