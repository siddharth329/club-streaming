/*
  Warnings:

  - You are about to alter the column `firstName` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to alter the column `lastName` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `firstName` VARCHAR(15) NOT NULL,
    MODIFY `lastName` VARCHAR(15) NOT NULL;
