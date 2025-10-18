import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { revokeInvitation } from "@/api/client/member.api";
import type { Invitation } from "@/api/schemas/member.schema";
import { useCurrentTenantId } from "@/hooks/use-current-tenant";

/**
 * Hook to revoke (cancel) an invitation
 * @returns Mutation to revoke invitation with optimistic updates
 */
export function useRevokeInvitationMutation() {
  const { t } = useTranslation("settings-members");
  const queryClient = useQueryClient();
  const tenantId = useCurrentTenantId();

  return useMutation({
    mutationFn: async (invitationId: string): Promise<void> => {
      await revokeInvitation(invitationId);
    },

    onMutate: async (invitationId) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ["invitations", tenantId] });

      // Snapshot
      const previousInvitations = queryClient.getQueryData<Invitation[]>(["invitations", tenantId]);

      // Optimistic update: mark as revoked
      if (previousInvitations) {
        queryClient.setQueryData<Invitation[]>(
          ["invitations", tenantId],
          previousInvitations.map((inv) =>
            inv.id === invitationId ? { ...inv, status: "revoked" as const } : inv
          )
        );
      }

      return { previousInvitations };
    },

    onError: (error, _invitationId, context) => {
      // Rollback
      if (context?.previousInvitations) {
        queryClient.setQueryData(["invitations", tenantId], context.previousInvitations);
      }

      toast.error(error.message || t("errors.revokeFailed"));
    },

    onSuccess: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["invitations", tenantId] });

      toast.success(t("success.invitationRevoked"));
    },
  });
}
