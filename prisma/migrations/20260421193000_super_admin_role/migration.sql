-- AlterEnum (standalone migration: Postgres requires this to commit before SUPER_ADMIN can be used.)
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';
