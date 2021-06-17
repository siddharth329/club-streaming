-- AlterTable
ALTER TABLE `episode` ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `publishedAt` DATETIME(3);
