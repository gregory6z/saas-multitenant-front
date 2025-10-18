import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { createTenant } from "@/api/client/tenant.api";
import type { CreateTenantRequest, Tenant } from "@/api/schemas/tenant.schema";
import { CreateTenantRequestSchema, CreateTenantResponseSchema } from "@/api/schemas/tenant.schema";
import { getDisplayDomain } from "@/lib/env";

/**
 * Hook to create a new tenant
 * @returns Mutation to create tenant with optimistic updates and redirect
 */
export function useCreateTenantMutation() {
  const { t } = useTranslation("common");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTenantRequest): Promise<Tenant> => {
      const validatedData = CreateTenantRequestSchema.parse(data);
      const response = await createTenant(validatedData);
      const validatedResponse = CreateTenantResponseSchema.parse(response);
      return validatedResponse.tenant;
    },

    onMutate: async (newTenantData) => {
      // Cancel outgoing refetches to avoid race conditions
      await queryClient.cancelQueries({ queryKey: ["tenants"] });

      // Snapshot previous state for rollback
      const previousTenants = queryClient.getQueryData<Tenant[]>(["tenants"]);

      // Optimistic update: add temporary tenant
      const tempTenant: Tenant = {
        id: `temp-${Date.now()}`,
        name: newTenantData.name,
        subdomain: newTenantData.subdomain,
        status: "active",
        ownerId: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Tenant[]>(["tenants"], (oldTenants) => {
        return oldTenants ? [...oldTenants, tempTenant] : [tempTenant];
      });

      return { previousTenants };
    },

    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousTenants) {
        queryClient.setQueryData(["tenants"], context.previousTenants);
      }

      toast.error(error.message || t("tenant.createError"));
    },

    onSuccess: (newTenant) => {
      // Invalidate to refetch and ensure consistency
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      toast.success(t("tenant.createSuccess"));

      // Redirect to new tenant subdomain
      const displayDomain = getDisplayDomain();
      const protocol = window.location.protocol;
      const newUrl = `${protocol}//${newTenant.subdomain}.${displayDomain}`;

      // Redirect to new tenant
      window.location.href = newUrl;
    },
  });
}
