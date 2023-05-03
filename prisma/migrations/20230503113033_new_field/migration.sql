/*
  Warnings:

  - Added the required column `active` to the `Servers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Servers" ADD COLUMN     "active" BOOLEAN NOT NULL;
