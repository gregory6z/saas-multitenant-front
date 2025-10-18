import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { updateTenant } from "@/api/client/tenant.api";
import {
  type Tenant,
  type UpdateTenantRequest,
  UpdateTenantResponseSchema,
} from "@/api/schemas/tenant.schema";
import { useCurrentTenantId } from "@/hooks/use-current-tenant";

/**
 * Hook to update tenant details
 * PUT /tenants
 * NOTE: Validation happens in the form (general.tsx) using the schema factory
 */
export function useUpdateTenantMutation() {
  const { t } = useTranslation("settings-general");
  const queryClient = useQueryClient();
  const tenantId = useCurrentTenantId();

  return useMutation({
    mutationFn: async (data: UpdateTenantRequest) => {
      // Validation already done in the form - just pass data through
      const response = await updateTenant(data);
      return UpdateTenantResponseSchema.parse(response).tenant;
    },

    onMutate: async (data) => {
      // Cancela refetches para evitar race conditions
      await queryClient.cancelQueries({ queryKey: ["tenants"] });
      await queryClient.cancelQueries({ queryKey: ["tenant", tenantId] });

      // Snapshot do estado anterior
      const previousTenants = queryClient.getQueryData<Tenant[]>(["tenants"]);
      const previousTenant = queryClient.getQueryData<Tenant>(["tenant", tenantId]);

      // Optimistic update na lista de tenants
      if (previousTenants && tenantId) {
        const updatedTenants = previousTenants.map((tenant) =>
          tenant.id === tenantId
            ? { ...tenant, ...data, updatedAt: new Date().toISOString() }
            : tenant
        );
        queryClient.setQueryData(["tenants"], updatedTenants);
      }

      // Optimistic update no tenant individual
      if (previousTenant) {
        queryClient.setQueryData(["tenant", tenantId], {
          ...previousTenant,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousTenants, previousTenant };
    },

    onError: (error, _variables, context) => {
      // Rollback completo
      if (context?.previousTenants) {
        queryClient.setQueryData(["tenants"], context.previousTenants);
      }
      if (context?.previousTenant && tenantId) {
        queryClient.setQueryData(["tenant", tenantId], context.previousTenant);
      }

      // Toast de erro
      const axiosError = error as Error & { response?: { status: number } };
      toast.error(axiosError.message || t("errors.updateFailed"));
    },

    onSuccess: (updatedTenant, variables) => {
      // Toast de sucesso
      toast.success(t("success.updated"));

      // Atualiza com dados reais do servidor
      queryClient.setQueryData(["tenant", updatedTenant.id], updatedTenant);

      queryClient.setQueryData<Tenant[]>(["tenants"], (oldTenants) => {
        if (!oldTenants) return [updatedTenant];
        return oldTenants.map((tenant) =>
          tenant.id === updatedTenant.id ? updatedTenant : tenant
        );
      });

      // Verifica se estamos em um subdomain e se mudou
      const currentHostname = window.location.hostname;
      const currentSubdomain = currentHostname.split(".")[0];

      // Se subdomain foi alterado E estamos em subdomain, redireciona
      if (
        variables.subdomain &&
        currentHostname.includes(".") &&
        currentSubdomain !== updatedTenant.subdomain
      ) {
        // Constrói nova URL com novo subdomain
        const protocol = window.location.protocol;
        const port = window.location.port ? `:${window.location.port}` : "";
        const pathname = window.location.pathname;
        const search = window.location.search;
        const hash = window.location.hash;

        // Detecta domínio base (lvh.me, multisaas.app, localhost)
        let baseDomain = "lvh.me";
        if (currentHostname.includes("multisaas.app")) {
          baseDomain = "multisaas.app";
        } else if (currentHostname.includes("localhost")) {
          baseDomain = "localhost";
        } else if (currentHostname.includes("lvh.me")) {
          baseDomain = "lvh.me";
        }

        const newUrl = `${protocol}//${updatedTenant.subdomain}.${baseDomain}${port}${pathname}${search}${hash}`;

        // Aguarda um pouco para garantir que cache foi atualizado
        setTimeout(() => {
          window.location.href = newUrl;
        }, 500);
      }
    },

    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
