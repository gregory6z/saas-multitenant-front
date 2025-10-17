import { useMutation, useQueryClient } from "@tanstack/react-query";
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
        toast.error("Você não tem permissão para alterar funções de membros");
      } else if (status === 404) {
        toast.error("Membro não encontrado");
      } else if (status === 400) {
        toast.error("Não é possível alterar sua própria função");
      } else {
        toast.error(error.message || "Erro ao alterar função do membro");
      }
    },

    onSuccess: () => {
      toast.success("Função alterada com sucesso");
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
