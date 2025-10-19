import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPortalSession } from "@/api/client/subscription.api";
import {
  type CreatePortalSessionRequest,
  CreatePortalSessionRequestSchema,
} from "@/api/schemas/subscription.schema";

/**
 * Mutation hook to create Stripe customer portal session
 *
 * Creates a customer portal session to manage subscription
 * Allows changing payment method, viewing invoices, etc.
 */
export function useCreatePortalSessionMutation() {
  return useMutation({
    mutationFn: async (data: CreatePortalSessionRequest) => {
      // Validate request data
      const validatedData = CreatePortalSessionRequestSchema.parse(data);
      const response = await createPortalSession(validatedData);
      return response;
    },
    onSuccess: (data) => {
      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404) {
        toast.error("Assinatura não encontrada");
      } else {
        toast.error(message || "Erro ao criar sessão do portal");
      }
    },
  });
}
