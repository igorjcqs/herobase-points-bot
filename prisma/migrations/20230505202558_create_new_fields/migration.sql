/*
  Warnings:

  - Added the required column `avatar` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
