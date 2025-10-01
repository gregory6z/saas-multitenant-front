import type { JWTPayload, TokenMetadata } from "./types";

/**
 * JWT utilities for decoding and validating tokens
 */

/**
 * Decode JWT payload without verification (client-side only)
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

/**
 * Extract token metadata from JWT
 */
export function extractTokenMetadata(token: string): TokenMetadata | null {
  const payload = decodeJWT(token);
  if (!payload) return null;

  return {
    token,
    expiresAt: payload.exp * 1000,
    issuedAt: payload.iat * 1000,
    userId: payload.sub,
  };
}
