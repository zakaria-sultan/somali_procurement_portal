import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthConfig, customFetch } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { createAuthPrismaAdapter } from "@/lib/auth-prisma-adapter";
import type { AppRole } from "@/lib/roles";
import { getGoogleOAuthCredentials } from "@/lib/google-oauth-env";
import { ensureSuperAdminBootstrapped } from "@/lib/super-admin-bootstrap";
import { googleOAuthFetch } from "@/lib/google-oauth-fetch";
import { canonicalizeOAuthEmail } from "@/lib/oauth-email";
import prisma from "@/lib/prisma";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
const { clientId: googleClientId, clientSecret: googleClientSecret } =
  getGoogleOAuthCredentials();

const providers: NextAuthConfig["providers"] = [
  Credentials({
    id: "credentials",
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = String(credentials?.email ?? "")
        .trim()
        .toLowerCase();
      const password = String(credentials?.password ?? "");
      if (!email || !password) return null;
      const user = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
      });
      if (!user?.passwordHash) return null;
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

if (googleClientId && googleClientSecret) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
      // Explicit endpoints avoid OIDC discovery fetches (accounts.google.com
      // /.well-known/...), which can throw `TypeError: fetch failed` in some
      // Node/undici or network setups even when the browser can reach Google.
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: {
          prompt: "select_account",
        },
      },
      token: "https://oauth2.googleapis.com/token",
      userinfo: "https://openidconnect.googleapis.com/v1/userinfo",
      profile(profile) {
        const email = profile.email
          ? canonicalizeOAuthEmail(profile.email)
          : profile.email;
        return {
          id: profile.sub,
          name: profile.name,
          email,
          image: profile.picture,
        };
      },
      // Auth.js reads this symbol at runtime; provider typings omit it.
      ...{ [customFetch]: googleOAuthFetch },
    } as Parameters<typeof Google>[0])
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: createAuthPrismaAdapter(prisma),
  trustHost: true,
  secret: authSecret,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers,
  events: {
    async signIn({ user }) {
      if (!user?.id) return;
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
      await ensureSuperAdminBootstrapped();
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        const id = String(user.id);
        await ensureSuperAdminBootstrapped();
        const dbUser = await prisma.user.findUnique({
          where: { id },
          select: { role: true },
        });
        const role = (dbUser?.role ?? "USER") as AppRole;
        token.id = id;
        token.sub = id;
        token.role = role;
        return token;
      }

      if (token.sub) {
        try {
          await ensureSuperAdminBootstrapped();
          const dbUser = await prisma.user.findUnique({
            where: { id: String(token.sub) },
            select: { role: true },
          });
          if (dbUser) {
            token.role = dbUser.role as AppRole;
          }
          token.id = String(token.sub);
        } catch {
          /* keep existing token */
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
        session.user.role = (token.role as AppRole) ?? "USER";
      }
      return session;
    },
  },
});
