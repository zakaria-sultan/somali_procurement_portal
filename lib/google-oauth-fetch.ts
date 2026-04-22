import { setDefaultResultOrder } from "node:dns";

/**
 * Google OAuth uses server-side fetch to `oauth2.googleapis.com`. On some Linux
 * setups Node resolves IPv6 first and the connection stalls (`ETIMEDOUT`), while
 * the browser works. Prefer IPv4 and retry transient failures.
 */
try {
  setDefaultResultOrder("ipv4first");
} catch {
  /* ignore if unavailable */
}

const TOKEN_ATTEMPTS = 3;
const TIMEOUT_MS = 45_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const c = err.cause;
  if (c && typeof c === "object" && "code" in c) {
    const code = String((c as { code: unknown }).code);
    return (
      code === "ETIMEDOUT" ||
      code === "ECONNRESET" ||
      code === "UND_ERR_CONNECT_TIMEOUT" ||
      code === "UND_ERR_HEADERS_TIMEOUT" ||
      code === "UND_ERR_BODY_TIMEOUT"
    );
  }
  return false;
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const signal = init?.signal ?? AbortSignal.timeout(TIMEOUT_MS);
  return fetch(input, {
    ...init,
    signal,
  });
}

/**
 * Use with `import { customFetch } from "next-auth"` — not `from "@auth/core"`.
 * npm often installs two `@auth/core` trees; each has its own `customFetch` symbol,
 * so Auth.js would ignore a hook keyed with the “wrong” symbol.
 */
export async function googleOAuthFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < TOKEN_ATTEMPTS; attempt++) {
    try {
      return await fetchWithTimeout(input, init);
    } catch (e) {
      lastError = e;
      if (attempt < TOKEN_ATTEMPTS - 1 && isRetryable(e)) {
        await sleep(300 * (attempt + 1));
        continue;
      }
      throw e;
    }
  }
  throw lastError;
}
