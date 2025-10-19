import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { changePlan } from "@/api/client/subscription.api";
import { type ChangePlanRequest, ChangePlanRequestSchema } from "@/api/schemas/subscription.schema";

/**
 * Mutation hook to change subscription plan
 *
 * Updates the current subscription plan
 * Works with proration (charges/credits proportional difference)
 */
export function useChangePlanMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("settings-plans");

  return useMutation({
    mutationFn: async (data: ChangePlanRequest) => {
      // Validate request data
      const validatedData = ChangePlanRequestSchema.parse(data);
      const response = await changePlan(validatedData);
      return response;
    },
    onSuccess: async () => {
      toast.success(t("toasts.planChanged"));
      // Invalidate subscription and plans to ensure synchronized data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["subscription"] }),
        queryClient.invalidateQueries({ queryKey: ["plans"] }),
      ]);
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || t("toasts.errors.invalidPlan"));
      } else if (status === 403) {
        toast.error(t("toasts.errors.noPermission"));
      } else if (status === 404) {
        toast.error(t("toasts.errors.notFound"));
      } else {
        toast.error(message || t("toasts.planChangeFailed"));
      }
    },
  });
}
