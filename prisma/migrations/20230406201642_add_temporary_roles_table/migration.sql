-- CreateTable
CREATE TABLE "Temporary_Roles" (
    "userId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "addedBy" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Temporary_Roles_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Temporary_Roles" ADD CONSTRAINT "Temporary_Roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
