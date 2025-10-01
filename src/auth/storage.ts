import { MAIN_DOMAIN } from "@/lib/env";
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

  // Store in localStorage (always works)
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_METADATA_KEY, JSON.stringify(metadata));
      debugLog("Token saved to localStorage");
    } catch (error) {
      throw new AuthStorageError("Failed to store token in localStorage", error);
    }
  }

  // Store in cookie for cross-subdomain access
  try {
    setCookie({
      name: COOKIE_NAME,
      value: token,
      days: COOKIE_EXPIRATION_DAYS,
    });
  } catch (error) {
    debugWarn("Failed to set cookie (non-critical):", error);
  }

  // Emit event
  emitAuthEvent("token_set");
}

/**
 * Get authentication token with automatic expiration validation
 */
export function getAuthToken(): string | null {
  let token: string | null = null;

  // For development (MAIN_DOMAIN), use localStorage only (simpler)
  const mainDomainHost = MAIN_DOMAIN.split(":")[0];
  if (typeof window !== "undefined" && window.location.hostname.includes(mainDomainHost)) {
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem(TOKEN_KEY);
      debugLog("Token retrieved from localStorage (dev):", token ? "found" : "not found");
    }
  } else {
    // Production: Try cookie first (cross-subdomain)
    const cookieToken = getCookie(COOKIE_NAME);
    if (cookieToken) {
      token = cookieToken;
      debugLog("Token retrieved from cookie");
    } else if (typeof localStorage !== "undefined") {
      // Fallback to localStorage
      token = localStorage.getItem(TOKEN_KEY);
      debugLog("Token retrieved from localStorage (fallback)");
    }
  }

  // Validate token expiration
  if (token && isTokenExpired(token)) {
    debugLog("Token expired, removing...");
    removeAuthToken();
    emitAuthEvent("token_expired");
    return null;
  }

  return token;
}

/**
 * Remove authentication token completely (cookie + localStorage)
 */
export function removeAuthToken(): void {
  // Remove cookie
  deleteCookie(COOKIE_NAME);

  // Remove from localStorage
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_METADATA_KEY);
  }

  // Emit event
  emitAuthEvent("token_removed");

  debugLog("Token removed completely");
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
  if (typeof localStorage === "undefined") return null;

  try {
    const metadataStr = localStorage.getItem(TOKEN_METADATA_KEY);
    if (!metadataStr) return null;

    const metadata = JSON.parse(metadataStr) as TokenMetadata;

    // Verify token hasn't changed
    const currentToken = getAuthToken();
    if (currentToken !== metadata.token) {
      localStorage.removeItem(TOKEN_METADATA_KEY);
      return null;
    }

    return metadata;
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
