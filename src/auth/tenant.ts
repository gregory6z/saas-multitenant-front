/**
 * Tenant-specific data management in localStorage
 */

const isDev = import.meta.env.DEV;

function debugLog(...args: unknown[]): void {
  if (isDev) {
    console.log("[Tenant]", ...args);
  }
}

function debugWarn(...args: unknown[]): void {
  if (isDev) {
    console.warn("[Tenant]", ...args);
  }
}

/**
 * Store tenant-specific data in localStorage (subdomain-scoped)
 */
export function setTenantData<T>(key: string, data: T): void {
  if (typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(`tenant:${key}`, JSON.stringify(data));
    debugLog(`Data saved: ${key}`);
  } catch (error) {
    debugWarn("Failed to store tenant data:", error);
  }
}

/**
 * Get tenant-specific data from localStorage (subdomain-scoped)
 */
export function getTenantData<T>(key: string): T | null {
  if (typeof localStorage === "undefined") return null;

  try {
    const data = localStorage.getItem(`tenant:${key}`);
    return data ? (JSON.parse(data) as T) : null;
  } catch (error) {
    debugWarn("Failed to retrieve tenant data:", error);
    return null;
  }
}

/**
 * Remove tenant-specific data from localStorage
 */
export function removeTenantData(key: string): void {
  if (typeof localStorage === "undefined") return;

  localStorage.removeItem(`tenant:${key}`);
  debugLog(`Data removed: ${key}`);
}

/**
 * Clear all tenant-specific data (useful for tenant switching)
 */
export function clearTenantData(): void {
  if (typeof localStorage === "undefined") return;

  const keys = Object.keys(localStorage);
  const tenantKeys = keys.filter((key) => key.startsWith("tenant:"));

  for (const key of tenantKeys) {
    localStorage.removeItem(key);
  }

  debugLog(`Cleared ${tenantKeys.length} data entries`);
}
