import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeAddon } from "@/api/client/subscription.api";
import { RemoveAddonResponseSchema } from "@/api/schemas/subscription.schema";
import type { RemoveAddonResponse } from "@/api/schemas/subscription.schema";

/**
 * Mutation hook to remove addon from subscription
 *
 * Removes an addon from the current subscription with refund credit
 * Invalidates subscription and addons queries on success
 */
export function useRemoveAddonMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addonId: string): Promise<RemoveAddonResponse> => {
      const response = await removeAddon(addonId);
      return RemoveAddonResponseSchema.parse(response);
    },
    onSuccess: (data) => {
      // Invalidate subscription and addons queries to refetch
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["addons"] });

      toast.success(data.message || "Addon removido com sucesso!");
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "Não foi possível remover o addon");
      } else if (status === 404) {
        toast.error("Addon não encontrado");
      } else if (status === 403) {
        toast.error("Você não possui uma assinatura ativa");
      } else {
        toast.error(message || "Erro ao remover addon");
      }
    },
  });
}
