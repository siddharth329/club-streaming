/*
  Warnings:

  - You are about to drop the column `likesCount` on the `episode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `episode` DROP COLUMN `likesCount`,
    ADD COLUMN `favCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isPaid` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `planExpiry` DATETIME(3);
