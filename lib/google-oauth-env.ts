/** Supports Auth.js (`AUTH_GOOGLE_*`) and legacy (`GOOGLE_CLIENT_*`) env names. */
export function getGoogleOAuthCredentials(): {
  clientId: string;
  clientSecret: string;
} {
  const clientId =
    process.env.AUTH_GOOGLE_ID?.trim() ||
    process.env.GOOGLE_CLIENT_ID?.trim() ||
    "";
  const clientSecret =
    process.env.AUTH_GOOGLE_SECRET?.trim() ||
    process.env.GOOGLE_CLIENT_SECRET?.trim() ||
    "";
  return { clientId, clientSecret };
}

export function isGoogleOAuthConfigured(): boolean {
  const { clientId, clientSecret } = getGoogleOAuthCredentials();
  return clientId.length > 0 && clientSecret.length > 0;
}
