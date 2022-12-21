/*
  Warnings:

  - You are about to drop the column `assinged_to_id` on the `todo` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_id` on the `todo` table. All the data in the column will be lost.
  - Added the required column `assinged_to_user_id` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "todo" DROP CONSTRAINT "todo_assinged_to_id_fkey";

-- DropForeignKey
ALTER TABLE "todo" DROP CONSTRAINT "todo_created_by_id_fkey";

-- AlterTable
ALTER TABLE "todo" DROP COLUMN "assinged_to_id",
DROP COLUMN "created_by_id",
ADD COLUMN     "assinged_to_user_id" INTEGER NOT NULL,
ADD COLUMN     "created_by_user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_assinged_to_user_id_fkey" FOREIGN KEY ("assinged_to_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
