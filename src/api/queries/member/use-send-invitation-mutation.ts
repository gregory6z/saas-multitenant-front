import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { sendInvitation } from "@/api/client/member.api";
import type { Invitation, SendInvitationRequest } from "@/api/schemas/member.schema";
import { InvitationSchema, SendInvitationRequestSchema } from "@/api/schemas/member.schema";
import { useCurrentTenantId } from "@/hooks/use-current-tenant";

/**
 * Hook to send a new invitation
 * @returns Mutation to send invitation with optimistic updates
 */
export function useSendInvitationMutation() {
  const { t } = useTranslation("settings-members");
  const queryClient = useQueryClient();
  const tenantId = useCurrentTenantId();

  return useMutation({
    mutationFn: async (data: SendInvitationRequest): Promise<Invitation> => {
      const validated = SendInvitationRequestSchema.parse(data);
      const response = await sendInvitation(validated);
      return InvitationSchema.parse(response.invitation);
    },

    onSuccess: (newInvitation) => {
      // Optimistically add new invitation to list
      queryClient.setQueryData<Invitation[]>(["invitations", tenantId], (old) => {
        return old ? [...old, newInvitation] : [newInvitation];
      });

      // Invalidate to refetch and ensure consistency
      queryClient.invalidateQueries({ queryKey: ["invitations", tenantId] });

      // Success toast
      toast.success(t("modals.invite.success"));
    },

    onError: (error) => {
      toast.error(error.message || t("modals.invite.error"));
    },
  });
}
