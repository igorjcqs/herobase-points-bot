/*
  Warnings:

  - A unique constraint covering the columns `[active]` on the table `Servers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Servers_active_key" ON "Servers"("active");
