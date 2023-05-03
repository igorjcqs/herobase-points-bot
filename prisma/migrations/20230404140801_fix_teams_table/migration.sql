/*
  Warnings:

  - You are about to drop the column `updateChannel` on the `Teams` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Teams_updateChannel_key";

-- AlterTable
ALTER TABLE "Teams" DROP COLUMN "updateChannel",
ADD COLUMN     "dataChannel" TEXT;
