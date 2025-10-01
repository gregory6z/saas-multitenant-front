import { getCookie, setCookie, deleteCookie } from "./cookie";
import { emitAuthEvent } from "./events";
import { extractTokenMetadata, isTokenExpired } from "./jwt";
import { AuthStorageError, type TokenMetadata } from "./types";

/**
 * Token storage management with JWT validation and cross-subdomain support
 */

const TOKEN_KEY = "ragboost:token";
const TOKEN_METADATA_KEY = "ragboost:token_metadata";
const COOKIE_NAME = "ragboost_auth_token";
const COOKIE_EXPIRATION_DAYS = 7;

const isDev = import.meta.env.DEV;

function debugLog(...args: unknown[]): void {
  if (isDev) {
    console.log("[AuthStorage]", ...args);
  }
}

function debugWarn(...args: unknown[]): void {
  if (isDev) {
    console.warn("[AuthStorage]", ...args);
  }
}

/**
 * Store authentication token with metadata and validation
 *
 * ESTRATÉGIA FINAL:
 * - Access token salvo em COOKIE JavaScript (Domain=.localhost)
 * - Cookie compartilhado entre TODOS os subdomains
 * - NÃO usar localStorage (isolado por subdomain)
 */
export function setAuthToken(token: string): void {
  // Validate token format
  const metadata = extractTokenMetadata(token);
  if (!metadata) {
    throw new AuthStorageError("Invalid JWT token format");
  }

  // Check if token is already expired
  if (isTokenExpired(token)) {
    throw new AuthStorageError("Cannot store expired token");
  }

  // Store APENAS em cookie (compartilhado entre subdomains)
  try {
    setCookie({
      name: COOKIE_NAME,
      value: token,
      days: COOKIE_EXPIRATION_DAYS,
    });
    debugLog("Token saved to cookie");
  } catch (error) {
    throw new AuthStorageError("Failed to store token in cookie", error);
  }

  // Emit event
  emitAuthEvent("token_set");
}

/**
 * Get authentication token with automatic expiration validation
 *
 * ESTRATÉGIA FINAL:
 * - Lê access token do COOKIE JavaScript (compartilhado entre subdomains)
 */
export function getAuthToken(): string | null {
  const token = getCookie(COOKIE_NAME);

  if (!token) {
    debugLog("No token found in cookie");
    return null;
  }

  // REMOVED: verbose log that pollutes console
  // debugLog("Token retrieved from cookie");

  // Validate token expiration
  if (isTokenExpired(token)) {
    debugLog("Token expired, removing...");
    removeAuthToken();
    emitAuthEvent("token_expired");
    return null;
  }

  return token;
}

/**
 * Remove authentication token completely
 */
export function removeAuthToken(): void {
  // Remove access token cookie (gerenciado pelo frontend)
  deleteCookie(COOKIE_NAME);
  debugLog("Access token removed from cookie");

  // NOTA: refreshToken (httpOnly) é gerenciado pelo backend
  // Será removido automaticamente quando expirar ou no logout do backend

  // Emit event
  emitAuthEvent("token_removed");
}

/**
 * Check if user is authenticated (has valid, non-expired token)
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  // Token is already validated by getAuthToken()
  return token !== null;
}

/**
 * Get token metadata (expiration, userId, etc.)
 */
export function getTokenMetadata(): TokenMetadata | null {
  const token = getAuthToken();
  if (!token) return null;

  try {
    return extractTokenMetadata(token);
  } catch {
    return null;
  }
}

/**
 * Get time until token expiration (in milliseconds)
 */
export function getTimeUntilExpiration(): number | null {
  const metadata = getTokenMetadata();
  if (!metadata) return null;

  const now = Date.now();
  const timeLeft = metadata.expiresAt - now;

  return timeLeft > 0 ? timeLeft : 0;
}
