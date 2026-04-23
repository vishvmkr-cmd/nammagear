import { OAuth2Client } from 'google-auth-library';

export function getGoogleOAuthClient(): OAuth2Client | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (!clientId || !clientSecret || !redirectUri) {
    return null;
  }
  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

export function isGoogleOAuthConfigured(): boolean {
  return getGoogleOAuthClient() !== null;
}
