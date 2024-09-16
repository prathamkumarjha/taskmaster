/*
  Warnings:

  - The values [MOVED,MARKED,UNMARKED] on the enum `audit_log_action` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `audit_log` MODIFY `entityType` ENUM('BOARD', 'LIST', 'CARD', 'CHECKLIST', 'TODO', 'LABEL', 'DATE', 'MEMBER') NOT NULL,
    MODIFY `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'MOVE', 'MARK', 'UNMARK', 'COMMENT', 'JOINED', 'LEFT') NOT NULL;
