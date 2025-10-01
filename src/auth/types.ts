/**
 * TypeScript types and interfaces for authentication module
 */

export interface CookieOptions {
  name: string;
  value: string;
  days?: number;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export interface JWTPayload {
  sub: string; // User ID
  exp: number; // Expiration timestamp (seconds)
  iat: number; // Issued at timestamp (seconds)
  [key: string]: unknown;
}

export interface TokenMetadata {
  token: string;
  expiresAt: number; // milliseconds
  issuedAt: number; // milliseconds
  userId: string;
}

export type AuthEventType = "token_set" | "token_removed" | "token_expired";

export interface AuthEvent {
  type: AuthEventType;
  timestamp: number;
}

/**
 * Custom error for authentication storage operations
 */
export class AuthStorageError extends Error {
  public readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "AuthStorageError";
    this.cause = cause;
  }
}
