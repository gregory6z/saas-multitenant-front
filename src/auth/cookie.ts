import { MAIN_DOMAIN, PRODUCTION_DOMAIN } from "@/lib/env";
import type { CookieOptions } from "./types";

/**
 * Cookie management utilities for cross-subdomain authentication
 */

const isDev = import.meta.env.DEV;

/**
 * Get the appropriate cookie domain for current environment
 * IMPORTANTE: Não cachear para funcionar corretamente quando trocar de subdomain
 *
 * Development: .lvh.me (domínio mágico que resolve para 127.0.0.1)
 * Production: .multisaas.app (domínio real)
 *
 * NOTA: .localhost não funciona pois Chrome bloqueia wildcard cookies nesse domínio
 */
export function getCookieDomain(): string {
  if (typeof window === "undefined") return "";

  const hostname = window.location.hostname;

  // Development: usa MAIN_DOMAIN do .env (ex: lvh.me:3000)
  // Remove porta e adiciona ponto inicial para wildcard subdomain
  const mainDomainHost = MAIN_DOMAIN.split(":")[0];
  if (hostname.includes(mainDomainHost)) {
    return `.${mainDomainHost}`;  // .lvh.me para funcionar em subdomains
  }

  // Production: usa PRODUCTION_DOMAIN do .env (ex: multisaas.app)
  // Adiciona ponto inicial para wildcard subdomain
  if (hostname.includes(PRODUCTION_DOMAIN)) {
    return `.${PRODUCTION_DOMAIN}`;
  }

  // Fallback: current domain
  return hostname;
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

  console.log(`[Cookie] ========= SETTING COOKIE =========`);
  console.log(`[Cookie] Name: ${name}`);
  console.log(`[Cookie] Domain: ${domain}`);
  console.log(`[Cookie] Secure: ${secure}`);
  console.log(`[Cookie] SameSite: ${sameSite}`);
  console.log(`[Cookie] Expires: ${expires.toUTCString()}`);
  console.log(`[Cookie] Current hostname: ${window.location.hostname}`);
  console.log(`[Cookie] Full cookie string: ${cookieString}`);

  document.cookie = cookieString;

  // Verifica se foi setado
  const wasSet = document.cookie.includes(`${name}=`);
  console.log(`[Cookie] Was set successfully: ${wasSet}`);
  if (!wasSet) {
    console.error(`[Cookie] ❌ FAILED to set cookie!`);
    console.error(`[Cookie] Current cookies: ${document.cookie}`);
  } else {
    console.log(`[Cookie] ✅ Cookie set successfully!`);
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
