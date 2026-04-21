import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { ADMIN_EMAIL } from "@/lib/auth-constants";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      /**
       * Lets a verified Google email attach to an existing user when IDs differ
       * (avoids OAuthAccountNotLinked in edge cases). Safer when Google is the
       * only auth provider.
       */
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  /**
   * Do not run DB writes in `callbacks.signIn` — it runs *before* the adapter
   * creates the User on first OAuth login, so `user.update` throws → AccessDenied.
   * `events.signIn` runs after the account is linked and the row exists.
   */
  events: {
    /** Ensure the configured super-admin is always ADMIN; other roles come from the database. */
    async signIn({ user }) {
      if (!user?.id || !user.email) return;
      if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
      }
    },
  },
  callbacks: {
    /**
     * IMPORTANT: Middleware runs on the Edge runtime. Do not call Prisma here when
     * `user` is absent (normal session refresh) — Prisma is Node-only and will
     * throw, Auth.js will clear the session cookie, and the user looks signed out.
     * Only load from the DB on explicit sign-in when `user` is present (Node route).
     */
    async jwt({ token, user, trigger }) {
      if (user?.id) {
        const id = String(user.id);
        const email = user.email?.toLowerCase() ?? "";
        let role: "ADMIN" | "USER" =
          email === ADMIN_EMAIL.toLowerCase() ? "ADMIN" : "USER";
        if (role === "USER") {
          const dbUser = await prisma.user.findUnique({
            where: { id },
            select: { role: true },
          });
          if (dbUser) role = dbUser.role as "ADMIN" | "USER";
        }
        token.id = id;
        token.sub = id;
        token.role = role;
        return token;
      }

      if (trigger === "update" && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: String(token.sub) },
          select: { role: true },
        });
        if (dbUser) token.role = dbUser.role as "ADMIN" | "USER";
        return token;
      }

      if (
        typeof token.email === "string" &&
        token.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
      ) {
        token.role = "ADMIN";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
        session.user.role = (token.role as "ADMIN" | "USER") ?? "USER";
      }
      return session;
    },
  },
});
