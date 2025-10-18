import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { deleteTenant } from "@/api/client/tenant.api";
import type { Tenant } from "@/api/schemas/tenant.schema";

/**
 * Hook to delete tenant (DESTRUCTIVE ACTION)
 * DELETE /tenants
 * - Backend identifies tenant by Origin header (subdomain)
 * - Only OWNER can delete (CASCADE deletes all related data)
 */
export function useDeleteTenantMutation() {
  const { t } = useTranslation("settings-general");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await deleteTenant();
    },

    onMutate: async () => {
      // Cancela queries em andamento
      await queryClient.cancelQueries({ queryKey: ["tenants"] });

      // Snapshot para rollback em caso de erro
      const previousTenants = queryClient.getQueryData<Tenant[]>(["tenants"]);

      return { previousTenants };
    },

    onError: (error, _variables, context) => {
      // Rollback em caso de erro
      if (context?.previousTenants) {
        queryClient.setQueryData(["tenants"], context.previousTenants);
      }

      // Toast de erro
      const axiosError = error as Error & { response?: { status: number } };
      if (axiosError.response?.status === 403) {
        toast.error(t("errors.deletePermissionDenied"));
      } else {
        toast.error(axiosError.message || t("errors.deleteFailed"));
      }
    },

    onSuccess: () => {
      // Toast de sucesso
      toast.success(t("success.deleted"));

      // Pega lista de tenants antes de limpar cache para decidir redirecionamento
      const tenants = queryClient.getQueryData<Tenant[]>(["tenants"]) || [];
      const currentHostname = window.location.hostname;
      const currentSubdomain = currentHostname.split(".")[0];

      // Remove tenant deletado da lista
      const remainingTenants = tenants.filter((t) => t.subdomain !== currentSubdomain);

      // Remove todas as queries relacionadas a tenants
      queryClient.removeQueries({ queryKey: ["tenants"] });
      queryClient.removeQueries({ queryKey: ["tenant"] });

      // Remove outras queries relacionadas ao tenant
      queryClient.removeQueries({ queryKey: ["chatbots"] });
      queryClient.removeQueries({ queryKey: ["chatbot"] });

      const protocol = window.location.protocol;
      const mainDomain = import.meta.env.VITE_MAIN_DOMAIN || "lvh.me:3000";

      let redirectUrl: string;

      if (remainingTenants.length === 0) {
        // Sem mais tenants → redireciona para criação de tenant
        redirectUrl = `${protocol}//${mainDomain}/dashboard/tenants/create`;
      } else {
        // Ainda há tenants → redireciona para o primeiro tenant disponível
        const nextTenant = remainingTenants[0];
        const [baseDomain, port] = mainDomain.split(":");
        const portSuffix = port ? `:${port}` : "";
        redirectUrl = `${protocol}//${nextTenant.subdomain}.${baseDomain}${portSuffix}/dashboard/chatbots`;
      }

      // Pequeno delay para garantir que o toast aparece antes do redirect
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    },

    retry: false, // Nunca retry em deleção
  });
}
