import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import type { AppRole } from "@/lib/roles";
import { ensureSuperAdminBootstrapped } from "@/lib/super-admin-bootstrap";
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
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
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
