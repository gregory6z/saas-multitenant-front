import { useMemo } from "react";
import { getCurrentSubdomain, hasSubdomain } from "@/hooks/use-subdomain";
import { useTenants } from "@/hooks/use-tenants";

/**
 * Hook to get current tenant context
 *
 * Strategy:
 * - With subdomain: Uses subdomain-based tenant detection (lvh.me, multisaas.app)
 * - Without subdomain: Uses first tenant from user's list (localhost, tenant root)
 */
export function useCurrentTenant() {
  const { tenants, isLoading } = useTenants();

  // Memoize subdomain check to avoid recalculation on every render
  const hasSubdomainContext = useMemo(() => hasSubdomain(), []);
  const currentSubdomain = useMemo(() => getCurrentSubdomain(), []);

  const currentTenant = useMemo(() => {
    if (!tenants) return null;

    // Strategy 1: If we have a subdomain, find matching tenant
    if (hasSubdomainContext && currentSubdomain) {
      return tenants.find((t) => t.subdomain === currentSubdomain) || null;
    }

    // Strategy 2: No subdomain (localhost, tenant root) - use first tenant
    return tenants[0] || null;
  }, [tenants, hasSubdomainContext, currentSubdomain]);

  return {
    currentTenant,
    isLoading,
    error: null,
    tenantId: currentTenant?.id || null,
  };
}

/**
 * Hook to get current tenant ID for API calls
 */
export function useCurrentTenantId(): string | null {
  const { tenantId } = useCurrentTenant();
  return tenantId;
}
