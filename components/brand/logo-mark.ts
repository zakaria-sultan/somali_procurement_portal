import type { StaticImageData } from "next/image";

import logoMark from "../../assets/brand/logo-mark.png";

/**
 * Bundled mark (content-hashed URL) — avoids stale CDN cache on `/public/...` URLs.
 * Replace `assets/brand/logo-mark.png`, then run `npm run icons:sync` (runs before `npm run build`).
 */
export const LOGO_MARK: StaticImageData = logoMark;
