import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { joinTenant } from "@/api/client/tenant.api";
import type { JoinTenantRequest, JoinTenantResponse } from "@/api/schemas/tenant.schema";
import { JoinTenantResponseSchema } from "@/api/schemas/tenant.schema";
import { getDisplayDomain } from "@/lib/env";

/**
 * Hook to join a tenant via invite code
 * @returns Mutation to join tenant and redirect
 * NOTE: Validation happens in the form (join-tenant-modal.tsx) using the schema factory
 */
export function useJoinTenantMutation() {
  const { t } = useTranslation("common");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: JoinTenantRequest): Promise<JoinTenantResponse> => {
      // Validation already done in the form - just pass data through
      const response = await joinTenant(data);
      return JoinTenantResponseSchema.parse(response);
    },

    onError: (error) => {
      toast.error(error.message || t("tenant.joinError"));
    },

    onSuccess: (result) => {
      // Invalidate tenants cache to refetch with new tenant
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      toast.success(t("tenant.joinSuccess"));

      // Redirect to newly joined tenant subdomain
      const displayDomain = getDisplayDomain();
      const protocol = window.location.protocol;
      const newUrl = `${protocol}//${result.tenant.subdomain}.${displayDomain}/dashboard/chatbots`;

      window.location.href = newUrl;
    },

    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      // Don't retry on invalid/expired codes (4xx)
      if (status && status >= 400 && status < 500) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
