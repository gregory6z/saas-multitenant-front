import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { updateMemberRole } from "@/api/client/member.api";
import type { Member, UpdateMemberRoleRequest } from "@/api/schemas/member.schema";
import { UpdateMemberRoleRequestSchema } from "@/api/schemas/member.schema";
import { useCurrentTenantId } from "@/hooks/use-current-tenant";

type ChangeMemberRoleParams = {
  userId: string;
  role: "admin" | "curator" | "user";
};

type ChangeMemberRoleContext = {
  previousMembers: Member[] | undefined;
};

/**
 * Mutation hook to change a member's role
 * PATCH /tenants/users/:userId/role
 */
export function useChangeMemberRoleMutation() {
  const { t } = useTranslation("settings-members");
  const queryClient = useQueryClient();
  const tenantId = useCurrentTenantId();

  return useMutation<void, Error, ChangeMemberRoleParams, ChangeMemberRoleContext>({
    mutationFn: async ({ userId, role }: ChangeMemberRoleParams): Promise<void> => {
      const validatedData: UpdateMemberRoleRequest = UpdateMemberRoleRequestSchema.parse({ role });
      await updateMemberRole(userId, validatedData);
    },

    onMutate: async ({ userId, role }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ["members", tenantId] });

      // Snapshot
      const previousMembers = queryClient.getQueryData<Member[]>(["members", tenantId]);

      // Optimistic update: update role
      if (previousMembers) {
        queryClient.setQueryData<Member[]>(
          ["members", tenantId],
          previousMembers.map((member) => (member.id === userId ? { ...member, role } : member))
        );
      }

      return { previousMembers };
    },

    onError: (error, _variables, context) => {
      // Rollback
      if (context?.previousMembers) {
        queryClient.setQueryData(["members", tenantId], context.previousMembers);
      }

      const status = (error as Error & { response?: { status: number } }).response?.status;

      if (status === 403) {
        toast.error(t("errors.changeRolePermissionDenied"));
      } else if (status === 404) {
        toast.error(t("errors.memberNotFound"));
      } else if (status === 400) {
        toast.error(t("errors.cannotChangeOwnRole"));
      } else {
        toast.error(error.message || t("errors.changeRoleFailed"));
      }
    },

    onSuccess: () => {
      toast.success(t("success.roleChanged"));
      // Invalidate to refetch with new role
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
