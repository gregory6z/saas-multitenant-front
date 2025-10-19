import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { createCheckoutSession } from "@/api/client/subscription.api";
import {
  type CreateCheckoutSessionRequest,
  CreateCheckoutSessionRequestSchema,
} from "@/api/schemas/subscription.schema";

/**
 * Mutation hook to create Stripe checkout session
 *
 * Creates a checkout session for plan upgrade/change
 * Automatically redirects to Stripe Checkout on success
 */
export function useCreateCheckoutSessionMutation() {
  const { t } = useTranslation("settings-plans");

  return useMutation({
    mutationFn: async (data: CreateCheckoutSessionRequest) => {
      // Validate request data
      const validatedData = CreateCheckoutSessionRequestSchema.parse(data);
      const response = await createCheckoutSession(validatedData);
      return response;
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || t("toasts.errors.noTenant"));
      } else if (status === 404) {
        toast.error(t("toasts.errors.planNotFound"));
      } else if (status === 409) {
        toast.error(message || t("toasts.errors.cannotChangePlan"));
      } else {
        toast.error(message || t("toasts.checkoutFailed"));
      }
    },
  });
}
