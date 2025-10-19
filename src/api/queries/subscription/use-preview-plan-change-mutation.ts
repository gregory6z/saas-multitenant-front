import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { previewPlanChange } from "@/api/client/subscription.api";
import {
  type PreviewPlanChangeRequest,
  PreviewPlanChangeRequestSchema,
} from "@/api/schemas/subscription.schema";

/**
 * Mutation hook to preview plan change
 *
 * Returns information about the plan change including proration
 * Used before confirming the plan change
 */
export function usePreviewPlanChangeMutation() {
  return useMutation({
    mutationFn: async (data: PreviewPlanChangeRequest) => {
      // Validate request data
      const validatedData = PreviewPlanChangeRequestSchema.parse(data);
      const response = await previewPlanChange(validatedData);
      return response;
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "Não foi possível calcular o preview");
      } else if (status === 404) {
        toast.error("Assinatura ou plano não encontrado");
      } else {
        toast.error(message || "Erro ao calcular preview da mudança");
      }
    },
  });
}
