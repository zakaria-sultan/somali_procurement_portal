import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

/** Absolute path to this repo (fixes Turbopack picking a parent `package-lock.json`). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  /** Admin forms upload images via Server Actions (Blob); default 1 MB is too small. */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
