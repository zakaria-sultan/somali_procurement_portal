-- CreateTable
CREATE TABLE "RegistrationDraft" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "residence" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationDraft_email_key" ON "RegistrationDraft"("email");

-- CreateIndex
CREATE INDEX "RegistrationDraft_expiresAt_idx" ON "RegistrationDraft"("expiresAt");
