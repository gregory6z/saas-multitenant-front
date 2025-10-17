import { useMutation, useQueryClient } from "@tanstack/react-query";
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
        toast.error("Você não tem permissão para remover este membro");
      } else if (status === 404) {
        toast.error("Membro não encontrado");
      } else if (status === 400) {
        toast.error("Não é possível remover o proprietário");
      } else {
        toast.error(error.message || "Erro ao remover membro");
      }
    },

    onSuccess: () => {
      toast.success("Membro removido com sucesso");
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
