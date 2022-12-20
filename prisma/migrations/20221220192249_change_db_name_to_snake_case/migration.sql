/*
  Warnings:

  - You are about to drop the column `assingedToId` on the `todo` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `todo` table. All the data in the column will be lost.
  - Added the required column `assinged_to_id` to the `todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "todo" DROP CONSTRAINT "todo_assingedToId_fkey";

-- DropForeignKey
ALTER TABLE "todo" DROP CONSTRAINT "todo_createdById_fkey";

-- AlterTable
ALTER TABLE "todo" DROP COLUMN "assingedToId",
DROP COLUMN "createdById",
ADD COLUMN     "assinged_to_id" INTEGER NOT NULL,
ADD COLUMN     "created_by_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_assinged_to_id_fkey" FOREIGN KEY ("assinged_to_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
