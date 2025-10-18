import { useQuery } from "@tanstack/react-query";
import { getTenants } from "@/api/client/tenant.api";
import { type Tenant, TenantsResponseSchema } from "@/api/schemas/tenant.schema";

/**
 * Hook to fetch all tenants for current user
 * GET /tenants
 */
export function useTenantsQuery() {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: async (): Promise<Tenant[]> => {
      const response = await getTenants();
      const validated = TenantsResponseSchema.parse(response);
      return validated.tenants;
    },
    staleTime: 5 * 60 * 1000, // 5min - dados mudam raramente
    gcTime: 30 * 60 * 1000, // 30min - mantém em cache durante sessão
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) return false; // Não retry 4xx
      return failureCount < 2; // Retry 2x em 5xx ou network issues
    },
    networkMode: "online",
    refetchOnWindowFocus: false, // Desabilitado - dados não mudam frequentemente
    refetchOnMount: true,
  });
}
