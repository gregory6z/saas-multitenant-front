import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addAddon } from "@/api/client/subscription.api";
import {
  type AddAddonRequest,
  type AddAddonResponse,
  AddAddonRequestSchema,
  AddAddonResponseSchema,
} from "@/api/schemas/subscription.schema";

/**
 * Mutation hook to add addon to subscription
 *
 * Adds an addon to the current subscription with proration
 * Invalidates subscription and addons queries on success
 */
export function useAddAddonMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddAddonRequest): Promise<AddAddonResponse> => {
      // Validate request data
      const validatedData = AddAddonRequestSchema.parse(data);
      const response = await addAddon(validatedData);
      return AddAddonResponseSchema.parse(response);
    },
    onSuccess: (data) => {
      // Invalidate subscription and addons queries to refetch
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["addons"] });

      toast.success(data.message || "Addon adicionado com sucesso!");
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "Não foi possível adicionar o addon");
      } else if (status === 404) {
        toast.error("Addon não encontrado");
      } else if (status === 403) {
        toast.error("Você não possui uma assinatura ativa");
      } else {
        toast.error(message || "Erro ao adicionar addon");
      }
    },
  });
}
