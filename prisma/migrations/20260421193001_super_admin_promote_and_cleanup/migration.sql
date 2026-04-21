-- Promote former single primary flags to SUPER_ADMIN
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE "isPrimarySuperAdmin" = true;

-- AlterTable
DROP INDEX IF EXISTS "User_isPrimarySuperAdmin_idx";
ALTER TABLE "User" DROP COLUMN "isPrimarySuperAdmin";
