/*
  Warnings:

  - You are about to drop the column `teamId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `Events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Histories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Temporary_Roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Histories" DROP CONSTRAINT "Histories_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Histories" DROP CONSTRAINT "Histories_userId_fkey";

-- DropForeignKey
ALTER TABLE "Teams" DROP CONSTRAINT "Teams_eventid_fkey";

-- DropForeignKey
ALTER TABLE "Temporary_Roles" DROP CONSTRAINT "Temporary_Roles_userId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_teamId_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "teamId";

-- DropTable
DROP TABLE "Events";

-- DropTable
DROP TABLE "Histories";

-- DropTable
DROP TABLE "Teams";

-- DropTable
DROP TABLE "Temporary_Roles";

-- CreateTable
CREATE TABLE "Servers" (
    "id" TEXT NOT NULL,
    "rankingMessage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Servers_pkey" PRIMARY KEY ("id")
);
