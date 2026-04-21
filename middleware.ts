import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Keep this file tiny — Vercel Hobby limits Edge middleware to 1 MB. Do not
 * import `auth` / Prisma / full NextAuth config here (that bundle exceeds the limit).
 * `/admin` is enforced in `app/admin/layout.tsx` via `assertAdmin()`.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== "/" && pathname.endsWith("/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/\/+$/, "");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
