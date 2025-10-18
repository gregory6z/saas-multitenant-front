import { useQuery } from "@tanstack/react-query";
import { getInvitations } from "@/api/client/member.api";
import type { Invitation } from "@/api/schemas/member.schema";
import { InvitationsResponseSchema } from "@/api/schemas/member.schema";
import { useCurrentTenantId } from "@/hooks/use-current-tenant";

/**
 * Hook to fetch invitations for current tenant
 * @returns Query with invitations list
 */
export function useInvitationsQuery() {
  const tenantId = useCurrentTenantId();

  return useQuery({
    queryKey: ["invitations", tenantId],
    queryFn: async (): Promise<Invitation[]> => {
      const response = await getInvitations();
      const validated = InvitationsResponseSchema.parse(response);
      return validated.invitations;
    },
    enabled: !!tenantId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
