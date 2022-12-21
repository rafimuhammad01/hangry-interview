/*
  Warnings:

  - You are about to drop the column `assinged_to_user_id` on the `todo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "todo" DROP CONSTRAINT "todo_assinged_to_user_id_fkey";

-- AlterTable
ALTER TABLE "todo" DROP COLUMN "assinged_to_user_id",
ADD COLUMN     "assigned_to_user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
