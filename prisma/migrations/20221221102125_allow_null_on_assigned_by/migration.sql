/*
  Warnings:

  - Made the column `created_by_user_id` on table `todo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "todo" DROP CONSTRAINT "todo_assinged_to_user_id_fkey";

-- DropForeignKey
ALTER TABLE "todo" DROP CONSTRAINT "todo_created_by_user_id_fkey";

-- AlterTable
ALTER TABLE "todo" ALTER COLUMN "assinged_to_user_id" DROP NOT NULL,
ALTER COLUMN "created_by_user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_assinged_to_user_id_fkey" FOREIGN KEY ("assinged_to_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
