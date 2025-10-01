import { MAIN_DOMAIN, PRODUCTION_DOMAIN } from "@/lib/env";
import type { CookieOptions } from "./types";

/**
 * Cookie management utilities for cross-subdomain authentication
 */

const isDev = import.meta.env.DEV;

let cachedDomain: string | null = null;

/**
 * Get the appropriate cookie domain for current environment (memoized)
 */
export function getCookieDomain(): string {
  if (cachedDomain) return cachedDomain;

  if (typeof window === "undefined") return "";

  const hostname = window.location.hostname;

  // Development: usa MAIN_DOMAIN do .env (ex: localhost:3000)
  // Remove porta para cookie domain
  const mainDomainHost = MAIN_DOMAIN.split(":")[0];
  if (hostname.includes(mainDomainHost)) {
    cachedDomain = mainDomainHost;
    return cachedDomain;
  }

  // Production: usa PRODUCTION_DOMAIN do .env (ex: multisaas.app)
  // Adiciona ponto inicial para wildcard subdomain
  if (hostname.includes(PRODUCTION_DOMAIN)) {
    cachedDomain = `.${PRODUCTION_DOMAIN}`;
    return cachedDomain;
  }

  // Fallback: current domain
  cachedDomain = hostname;
  return cachedDomain;
}

/**
 * Set cookie with appropriate domain for subdomain sharing
 */
export function setCookie(options: CookieOptions): void {
  const {
    name,
    value,
    days = 7,
    secure = window.location.protocol === "https:",
    sameSite = "Lax",
  } = options;

  const domain = getCookieDomain();
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const cookieParts = [
    `${name}=${value}`,
    `expires=${expires.toUTCString()}`,
    `domain=${domain}`,
    "path=/",
    `SameSite=${sameSite}`,
  ];

  if (secure) {
    cookieParts.push("Secure");
  }

  const cookieString = cookieParts.join("; ");
  document.cookie = cookieString;

  if (isDev) {
    console.log(`[Cookie] Set: ${name} (domain: ${domain})`);
  }
}

/**
 * Get cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue || null;
  }

  return null;
}

/**
 * Delete cookie by setting expiration in the past
 */
export function deleteCookie(name: string): void {
  const domain = getCookieDomain();

  const cookieParts = [
    `${name}=`,
    "expires=Thu, 01 Jan 1970 00:00:00 UTC",
    `domain=${domain}`,
    "path=/",
  ];

  const cookieString = cookieParts.join("; ");
  document.cookie = cookieString;

  if (isDev) {
    console.log(`[Cookie] Deleted: ${name} (domain: ${domain})`);
  }
}
