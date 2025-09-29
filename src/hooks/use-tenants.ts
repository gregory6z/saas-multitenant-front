import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { api } from "@/lib/axios";

// Zod schema for tenant validation
const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  subdomain: z.string(),
  status: z.enum(["active", "inactive"]),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  ragflowId: z.string(),
});

const TenantsResponseSchema = z.object({
  tenants: z.array(TenantSchema),
});

export type Tenant = z.infer<typeof TenantSchema>;
export type TenantsResponse = z.infer<typeof TenantsResponseSchema>;

export function useTenants() {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["tenants"],
    queryFn: async (): Promise<Tenant[]> => {
      const response = await api.get("/tenants");
      const validatedData = TenantsResponseSchema.parse(response.data);
      return validatedData.tenants;
    },
    // Optimizations for header/subdomain usage
    staleTime: 30 * 60 * 1000, // 30 minutes - data is persistent throughout session
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache for entire session
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      // Don't retry on client errors (400-499)
      if (status && status >= 400 && status < 500) {
        return false;
      }
      // Retry up to 2 times on server errors or network issues
      return failureCount < 2;
    },
    networkMode: "online", // Only execute when online
    refetchOnWindowFocus: false, // Critical: don't refetch on tab focus
    refetchOnMount: false, // Don't refetch on every component mount
    refetchInterval: false, // No automatic polling
    refetchIntervalInBackground: false, // No background polling
    onSuccess: (data: Tenant[]) => {
      // Redirect to tenant creation if user has no tenants
      if (data.length === 0) {
        navigate({ to: "/tenants/create" });
      }
    },
  });
}