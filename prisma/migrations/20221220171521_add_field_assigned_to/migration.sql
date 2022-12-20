/*
  Warnings:

  - You are about to drop the column `userId` on the `todo` table. All the data in the column will be lost.
  - Added the required column `assingedToId` to the `todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "todo" DROP CONSTRAINT "todo_userId_fkey";

-- AlterTable
ALTER TABLE "todo" DROP COLUMN "userId",
ADD COLUMN     "assingedToId" INTEGER NOT NULL,
ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_assingedToId_fkey" FOREIGN KEY ("assingedToId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
