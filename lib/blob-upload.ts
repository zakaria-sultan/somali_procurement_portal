import { put } from "@vercel/blob";

/** Blob path prefix for all admin uploads (marketplace/blog images). */
export const ADMIN_BLOB_PREFIX = "spp";

function blobStoreAccess(): "public" | "private" {
  return process.env.BLOB_STORE_ACCESS === "private" ? "private" : "public";
}

/**
 * Upload a file to Vercel Blob. Uses `BLOB_STORE_ACCESS`:
 * - unset / `public` — `access: "public"`, returns the Blob CDN URL (store must be public).
 * - `private` — `access: "private"`, returns `/api/blob/spp/...` (store must be private).
 */
export async function putAdminBlob(file: File): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }
  const access = blobStoreAccess();
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  const pathname = `${ADMIN_BLOB_PREFIX}/${Date.now()}-${safe}`;
  const blob = await put(pathname, file, { access, token });
  if (access === "private") {
    return `/api/blob/${pathname}`;
  }
  return blob.url;
}
