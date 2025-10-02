import { useTenants } from "@/hooks/use-tenants";

/**
 * Hook to detect current subdomain and return matching tenant
 * NO API CALL - uses data from useTenants() which is already cached
 *
 * IMPORTANTE: Backend não tem endpoint /tenants/by-subdomain/{subdomain}
 * Usamos GET /tenants que retorna todos os tenants do usuário
 */
export function useSubdomain() {
  const { tenants } = useTenants();
  const subdomain = getCurrentSubdomain();

  // Find tenant that matches current subdomain
  const currentTenant =
    subdomain && tenants ? tenants.find((t) => t.subdomain === subdomain) : null;

  return {
    data: currentTenant || null,
    subdomain,
  };
}

/**
 * Utility function to get current subdomain (client-side only)
 */
export const getCurrentSubdomain = (): string | null => {
  if (typeof window === "undefined") return null;

  const hostname = window.location.hostname;

  // Development: lvh.me (domínio mágico)
  if (hostname.includes("lvh.me")) {
    const parts = hostname.split(".");
    // tenant1.lvh.me → return "tenant1", lvh.me → return null
    return parts.length > 2 ? parts[0] : null;
  }

  // Development: localhost
  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    return parts.length > 1 ? parts[0] : null;
  }

  // Production
  if (hostname.includes("multisaas.app")) {
    const parts = hostname.split(".");
    return parts.length > 2 ? parts[0] : null;
  }

  return null;
};

/**
 * Check if current URL has a subdomain
 */
export const hasSubdomain = (): boolean => {
  return getCurrentSubdomain() !== null;
};
