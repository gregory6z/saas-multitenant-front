import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
});

const TenantsResponseSchema = z.object({
  tenants: z.array(TenantSchema),
});

const CreateTenantRequestSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  subdomain: z
    .string()
    .min(3, "Subdomínio deve ter pelo menos 3 caracteres")
    .max(63, "Subdomínio deve ter no máximo 63 caracteres")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Subdomínio deve conter apenas letras minúsculas, números e hífens"
    ),
});

const CreateTenantResponseSchema = z.object({
  tenant: TenantSchema,
});

export type Tenant = z.infer<typeof TenantSchema>;
export type TenantsResponse = z.infer<typeof TenantsResponseSchema>;
export type CreateTenantRequest = z.infer<typeof CreateTenantRequestSchema>;
export type CreateTenantResponse = z.infer<typeof CreateTenantResponseSchema>;

export function useTenants() {
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
    // Note: Tenant creation redirect is now handled in the auth flow
  });
}

// Hook para criar um novo tenant
export function useCreateTenant() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (tenantData: CreateTenantRequest) => {
      const validatedData = CreateTenantRequestSchema.parse(tenantData);
      const response = await api.post("/tenants", validatedData);
      const validatedResponse = CreateTenantResponseSchema.parse(response.data);
      return validatedResponse.tenant;
    },
    onSuccess: (newTenant) => {
      // Update tenants cache with the new tenant
      queryClient.setQueryData<Tenant[]>(["tenants"], (oldTenants) => {
        return oldTenants ? [...oldTenants, newTenant] : [newTenant];
      });

      // Redirect after successful creation
      const currentHost = window.location.host;
      
      if (currentHost.includes("localhost")) {
        // Development: Don't use subdomains, just go to dashboard
        console.log("Development mode: redirecting to dashboard after tenant creation");
        navigate({ to: "/dashboard/chatbots" });
      } else {
        // Production: redirect to tenant's subdomain
        const protocol = window.location.protocol;
        const subdomainUrl = `${protocol}//${newTenant.subdomain}.multisaas.app/dashboard/chatbots`;
        
        console.log("Production mode: redirecting to tenant subdomain:", subdomainUrl);
        window.location.href = subdomainUrl;
      }
    },
    onError: (error) => {
      console.error("Erro ao criar tenant:", error);
    },
  });
}
