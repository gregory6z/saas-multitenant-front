import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { transferOwnership } from "@/api/client/member.api";
import type {
  TransferOwnershipRequest,
  TransferOwnershipResponse,
} from "@/api/schemas/member.schema";
import {
  TransferOwnershipRequestSchema,
  TransferOwnershipResponseSchema,
} from "@/api/schemas/member.schema";
import { useCurrentTenantId } from "@/hooks/use-current-tenant";

/**
 * Mutation hook to transfer workspace ownership
 * POST /tenants/transfer-ownership
 */
export function useTransferOwnershipMutation() {
  const { t } = useTranslation("settings-members");
  const queryClient = useQueryClient();
  const tenantId = useCurrentTenantId();

  return useMutation<TransferOwnershipResponse, Error, TransferOwnershipRequest>({
    mutationFn: async (data: TransferOwnershipRequest): Promise<TransferOwnershipResponse> => {
      const validatedData = TransferOwnershipRequestSchema.parse(data);
      const response = await transferOwnership(validatedData);
      return TransferOwnershipResponseSchema.parse(response);
    },

    onSuccess: () => {
      toast.success(t("success.ownershipTransferred"));

      // Invalidate members to refetch with new roles
      queryClient.invalidateQueries({
        queryKey: ["members", tenantId],
      });

      // Invalidate tenants to refetch with new ownerId
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });
    },

    onError: (error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;

      if (status === 403) {
        toast.error(t("errors.transferOwnershipPermissionDenied"));
      } else if (status === 404) {
        toast.error(t("errors.memberNotFound"));
      } else if (status === 400) {
        toast.error(t("errors.transferOwnershipInvalidMember"));
      } else {
        toast.error(error.message || t("errors.transferOwnershipFailed"));
      }
    },

    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) return false;
      return failureCount < 1;
    },
  });
}
