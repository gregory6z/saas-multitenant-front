/**
 * Authentication storage utilities for multi-tenant subdomain architecture
 * 
 * Uses cookies for cross-subdomain token sharing and localStorage for tenant-specific data
 */

const TOKEN_KEY = "ragboost:token";
const COOKIE_NAME = "ragboost_auth_token";

/**
 * Get the appropriate cookie domain for current environment
 */
function getCookieDomain(): string {
  if (typeof window === "undefined") return "";
  
  const hostname = window.location.hostname;
  
  // Development: localhost (sem ponto para funcionar em subdomínios)
  if (hostname.includes("localhost")) {
    return "localhost";
  }
  
  // Production: .multisaas.app
  if (hostname.includes("multisaas.app")) {
    return ".multisaas.app";
  }
  
  // Fallback: current domain
  return hostname;
}

/**
 * Set cookie with appropriate domain for subdomain sharing
 */
function setCookie(name: string, value: string, days = 7): void {
  const domain = getCookieDomain();
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  const cookieString = [
    `${name}=${value}`,
    `expires=${expires.toUTCString()}`,
    `domain=${domain}`,
    "path=/",
    "SameSite=Lax",
    // Add Secure flag in production
    ...(window.location.protocol === "https:" ? ["Secure"] : []),
  ].join("; ");
  
  document.cookie = cookieString;
}

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | null {
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
function deleteCookie(name: string): void {
  const domain = getCookieDomain();
  
  const cookieString = [
    `${name}=`,
    "expires=Thu, 01 Jan 1970 00:00:00 UTC",
    `domain=${domain}`,
    "path=/",
  ].join("; ");
  
  document.cookie = cookieString;
}

/**
 * Store authentication token (uses cookie for cross-subdomain access)
 */
export function setAuthToken(token: string): void {
  // Store in localStorage first (always works)
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
  
  // Try to store in cookie for cross-subdomain access
  try {
    setCookie(COOKIE_NAME, token, 7); // 7 days
    console.log("Cookie set successfully for domain:", getCookieDomain());
  } catch (error) {
    console.warn("Failed to set cookie:", error);
  }
}

/**
 * Get authentication token (prioritizes cookie, falls back to localStorage)
 */
export function getAuthToken(): string | null {
  // For development with localhost, use localStorage only (simpler)
  if (typeof window !== "undefined" && window.location.hostname.includes("localhost")) {
    if (typeof localStorage !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      console.log("Getting token from localStorage (localhost):", token ? "found" : "not found");
      return token;
    }
  }
  
  // Try cookie first (cross-subdomain for production)
  const cookieToken = getCookie(COOKIE_NAME);
  if (cookieToken) {
    console.log("Getting token from cookie:", "found");
    return cookieToken;
  }
  
  // Fallback to localStorage
  if (typeof localStorage !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log("Getting token from localStorage (fallback):", token ? "found" : "not found");
    return token;
  }
  
  console.log("No token found anywhere");
  return null;
}

/**
 * Remove authentication token (clears both cookie and localStorage)
 */
export function removeAuthToken(): void {
  // Remove cookie
  deleteCookie(COOKIE_NAME);
  
  // Remove from localStorage
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return token !== null && token.length > 0;
}

/**
 * Store tenant-specific data in localStorage (subdomain-scoped)
 */
export function setTenantData<T>(key: string, data: T): void {
  if (typeof localStorage === "undefined") return;
  
  try {
    localStorage.setItem(`tenant:${key}`, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to store tenant data:", error);
  }
}

/**
 * Get tenant-specific data from localStorage (subdomain-scoped)
 */
export function getTenantData<T>(key: string): T | null {
  if (typeof localStorage === "undefined") return null;
  
  try {
    const data = localStorage.getItem(`tenant:${key}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn("Failed to retrieve tenant data:", error);
    return null;
  }
}

/**
 * Remove tenant-specific data from localStorage
 */
export function removeTenantData(key: string): void {
  if (typeof localStorage === "undefined") return;
  
  localStorage.removeItem(`tenant:${key}`);
}

/**
 * Clear all tenant-specific data (useful for tenant switching)
 */
export function clearTenantData(): void {
  if (typeof localStorage === "undefined") return;
  
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("tenant:")) {
      localStorage.removeItem(key);
    }
  });
}