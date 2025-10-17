import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/api/client/member.api";
import type { Member } from "@/api/schemas/member.schema";
import { MembersResponseSchema } from "@/api/schemas/member.schema";
import { useCurrentTenantId } from "@/hooks/use-current-tenant";

/**
 * Query hook to fetch workspace members
 * GET /users
 */
export function useMembersQuery() {
  const tenantId = useCurrentTenantId();

  return useQuery({
    queryKey: ["members", tenantId],
    queryFn: async (): Promise<Member[]> => {
      if (!tenantId) throw new Error("No tenant ID available");

      const response = await getMembers();
      const validated = MembersResponseSchema.parse(response);
      return validated.users;
    },
    enabled: !!tenantId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
  });
}
