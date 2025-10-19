import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { cancelSubscription } from "@/api/client/subscription.api";
import {
  type CancelSubscriptionRequest,
  CancelSubscriptionRequestSchema,
} from "@/api/schemas/subscription.schema";

/**
 * Mutation hook to cancel subscription
 *
 * Cancels the current tenant's subscription
 * By default, cancels at the end of the current period
 */
export function useCancelSubscriptionMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("settings-plans");

  return useMutation({
    mutationFn: async (data?: CancelSubscriptionRequest) => {
      // Validate request data with defaults
      const validatedData = CancelSubscriptionRequestSchema.parse(data || {});
      const response = await cancelSubscription(validatedData);
      return response;
    },
    onSuccess: async () => {
      toast.success(t("toasts.subscriptionCanceled"));
      await queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404) {
        toast.error(t("toasts.errors.notFound"));
      } else {
        toast.error(message || t("toasts.subscriptionCancelFailed"));
      }
    },
  });
}
