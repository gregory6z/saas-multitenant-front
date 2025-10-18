import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { removeMember } from "@/api/client/member.api";
import type { Member } from "@/api/schemas/member.schema";
import { useCurrentTenantId } from "@/hooks/use-current-tenant";

type RemoveMemberContext = {
  previousMembers: Member[] | undefined;
};

/**
 * Mutation hook to remove a member
 * DELETE /tenants/users/:userId
 */
export function useRemoveMemberMutation() {
  const { t } = useTranslation("settings-members");
  const queryClient = useQueryClient();
  const tenantId = useCurrentTenantId();

  return useMutation<void, Error, string, RemoveMemberContext>({
    mutationFn: async (userId: string): Promise<void> => {
      await removeMember(userId);
    },

    onMutate: async (userId) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["members", tenantId] });

      // Snapshot previous data
      const previousMembers = queryClient.getQueryData<Member[]>(["members", tenantId]);

      // Optimistic update: remove member from list
      if (previousMembers) {
        queryClient.setQueryData<Member[]>(
          ["members", tenantId],
          previousMembers.filter((member) => member.id !== userId)
        );
      }

      return { previousMembers };
    },

    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousMembers) {
        queryClient.setQueryData(["members", tenantId], context.previousMembers);
      }

      const status = (error as Error & { response?: { status: number } }).response?.status;

      if (status === 403) {
        toast.error(t("errors.removePermissionDenied"));
      } else if (status === 404) {
        toast.error(t("errors.memberNotFound"));
      } else if (status === 400) {
        toast.error(t("errors.cannotRemoveOwner"));
      } else {
        toast.error(error.message || t("errors.removeFailed"));
      }
    },

    onSuccess: () => {
      toast.success(t("success.memberRemoved"));
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["members", tenantId],
        refetchType: "active",
      });
    },

    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) return false;
      return failureCount < 1;
    },
  });
}
