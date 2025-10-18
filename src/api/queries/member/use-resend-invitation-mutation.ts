import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { resendInvitation } from "@/api/client/member.api";
import { useCurrentTenantId } from "@/hooks/use-current-tenant";

/**
 * Hook to resend an invitation email
 * @returns Mutation to resend invitation
 */
export function useResendInvitationMutation() {
  const { t } = useTranslation("settings-members");
  const queryClient = useQueryClient();
  const tenantId = useCurrentTenantId();

  return useMutation({
    mutationFn: async (invitationId: string): Promise<void> => {
      await resendInvitation(invitationId);
    },

    onSuccess: () => {
      // Invalidate to refetch (may update timestamps)
      queryClient.invalidateQueries({ queryKey: ["invitations", tenantId] });

      toast.success(t("success.invitationResent"));
    },

    onError: (error) => {
      toast.error(error.message || t("errors.resendFailed"));
    },
  });
}
