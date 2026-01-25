/*
  Warnings:

  - A unique constraint covering the columns `[cid]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cid` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayUsername` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_email_key";

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN DEFAULT false,
ADD COLUMN     "cid" TEXT NOT NULL,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "displayUsername" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "tel" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_cid_key" ON "user"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_username_key" ON "user"("email", "username");
