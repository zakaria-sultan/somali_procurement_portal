import type { PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";

/**
 * PrismaAdapter's default `getUserByEmail` uses `findUnique({ where: { email } })`,
 * which is case-sensitive and ignores Gmail dot-equivalence. That can miss an
 * existing user, trigger `createUser`, and raise P2002 — surfaced by Auth.js as
 * `error=Configuration`.
 */
export async function findUserByEmailForOAuth(
  prisma: PrismaClient,
  email: string
): Promise<User | null> {
  const trimmed = email.trim();
  if (!trimmed) return null;

  const rows = await prisma.$queryRaw<User[]>`
    SELECT * FROM "User"
    WHERE email IS NOT NULL
    AND (
      LOWER(TRIM(email)) = LOWER(TRIM(${trimmed}))
      OR (
        (LOWER(email) LIKE '%@gmail.com' OR LOWER(email) LIKE '%@googlemail.com')
        AND LOWER(
          REPLACE(SPLIT_PART(email, '@', 1), '.', '')
          || '@'
          || SPLIT_PART(LOWER(email), '@', 2)
        ) = LOWER(
          REPLACE(SPLIT_PART(${trimmed}, '@', 1), '.', '')
          || '@'
          || SPLIT_PART(LOWER(${trimmed}), '@', 2)
        )
      )
    )
    LIMIT 1
  `;
  return rows[0] ?? null;
}
