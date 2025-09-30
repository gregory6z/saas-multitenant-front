import { useSubdomain } from "@/hooks/use-subdomain";
import { useTenants } from "@/hooks/use-tenants";

/**
 * Hook to get current tenant context
 * 
 * In development: Uses the first tenant from user's tenant list
 * In production: Uses subdomain-based tenant detection
 */
export function useCurrentTenant() {
  const { data: subdomainTenant, isLoading: subdomainLoading } = useSubdomain();
  const { data: userTenants, isLoading: tenantsLoading } = useTenants();

  const isLocalhost = typeof window !== "undefined" && window.location.host.includes("localhost");

  if (isLocalhost) {
    // Development: Use first tenant from user's list
    const currentTenant = userTenants?.[0] || null;
    return {
      currentTenant,
      isLoading: tenantsLoading,
      error: null,
      tenantId: currentTenant?.id || null,
    };
  } else {
    // Production: Use subdomain detection
    return {
      currentTenant: subdomainTenant,
      isLoading: subdomainLoading,
      error: null,
      tenantId: subdomainTenant?.id || null,
    };
  }
}

/**
 * Hook to get current tenant ID for API calls
 */
export function useCurrentTenantId(): string | null {
  const { tenantId } = useCurrentTenant();
  return tenantId;
}