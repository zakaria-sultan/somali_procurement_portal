-- AlterTable
ALTER TABLE "User" ADD COLUMN "isPrimarySuperAdmin" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "lastLoginAt" TIMESTAMP(3);
