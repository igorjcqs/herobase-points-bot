/*
  Warnings:

  - A unique constraint covering the columns `[rankingMessage]` on the table `Servers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Servers_rankingMessage_key" ON "Servers"("rankingMessage");
