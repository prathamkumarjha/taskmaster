-- AlterTable
ALTER TABLE `audit_log` MODIFY `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'MOVED', 'MARKED', 'UNMARKED') NOT NULL;
