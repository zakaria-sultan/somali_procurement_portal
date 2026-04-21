import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

import { ADMIN_BLOB_PREFIX } from "@/lib/blob-upload";

type RouteParams = { path: string[] };

function isAllowedPathname(pathname: string): boolean {
  if (pathname.includes("..") || pathname.startsWith("/")) return false;
  return (
    pathname.startsWith(`${ADMIN_BLOB_PREFIX}/`) && pathname.length > ADMIN_BLOB_PREFIX.length + 1
  );
}

/**
 * Proxies private Blob objects to the browser. Public site images are stored as
 * `/api/blob/spp/...` when `BLOB_STORE_ACCESS=private`.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<RouteParams> }
) {
  const { path } = await ctx.params;
  const pathname = path.join("/");
  if (!isAllowedPathname(pathname)) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return new NextResponse("Blob not configured", { status: 503 });
  }

  const access = process.env.BLOB_STORE_ACCESS === "private" ? "private" : "public";
  const result = await get(pathname, { access, token });
  if (!result || result.statusCode !== 200) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { stream, blob } = result;
  return new NextResponse(stream, {
    headers: {
      "Content-Type": blob.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
