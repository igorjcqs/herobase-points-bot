/*
  Warnings:

  - Added the required column `roleId` to the `Temporary_Roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Temporary_Roles" ADD COLUMN     "roleId" TEXT NOT NULL;
