import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useCurrentTenantId } from "@/hooks/use-current-tenant";
import { useUser } from "@/hooks/use-users";
import { api } from "@/lib/axios";
import { TenantUserSchema } from "@/lib/schemas/users";

// Response schema for team members list
const TeamMembersResponseSchema = z.object({
  users: z.array(TenantUserSchema),
});

export type TeamMember = z.infer<typeof TenantUserSchema>;
export type TeamMembersResponse = z.infer<typeof TeamMembersResponseSchema>;

/**
 * Hook to fetch team members of current tenant
 */
export function useTeamMembers() {
  const tenantId = useCurrentTenantId();

  return useQuery({
    queryKey: ["team-members", tenantId],
    queryFn: async (): Promise<TeamMember[]> => {
      if (!tenantId) throw new Error("No tenant ID available");

      const response = await api.get("/users");
      const validated = TeamMembersResponseSchema.parse(response.data);
      return validated.users;
    },
    enabled: !!tenantId,
    staleTime: 2 * 60 * 1000, // 2 minutes - team data doesn't change often
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to remove a team member
 */
export function useRemoveMember() {
  const queryClient = useQueryClient();
  const tenantId = useCurrentTenantId();

  return useMutation({
    mutationFn: async (userId: string): Promise<void> => {
      if (!tenantId) throw new Error("No tenant ID available");
      await api.delete(`/tenants/users/${userId}`);
    },

    onMutate: async (userId) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["team-members", tenantId] });

      // Snapshot previous data
      const previousMembers = queryClient.getQueryData<TeamMember[]>(["team-members", tenantId]);

      // Optimistic update: remove member from list
      if (previousMembers) {
        queryClient.setQueryData<TeamMember[]>(
          ["team-members", tenantId],
          previousMembers.filter((member) => member.id !== userId)
        );
      }

      return { previousMembers };
    },

    onError: (_error, _userId, context) => {
      // Rollback on error
      if (context?.previousMembers) {
        queryClient.setQueryData(["team-members", tenantId], context.previousMembers);
      }
    },

    onSuccess: () => {
      // Refetch to ensure consistency - force refetch even if stale time hasn't passed
      queryClient.invalidateQueries({
        queryKey: ["team-members", tenantId],
        refetchType: "active",
      });
    },
  });
}

/**
 * Hook to update a member's role
 * Hierarchy: owner > admin > curator > user
 * - owner: can change any role (except owner)
 * - admin: can PROMOTE to admin, but CANNOT DEMOTE from admin
 * - curator/user: cannot change roles
 */
export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  const tenantId = useCurrentTenantId();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: "admin" | "curator" | "user";
    }): Promise<void> => {
      if (!tenantId) throw new Error("No tenant ID available");
      await api.patch(`/tenants/users/${userId}/role`, { role });
    },

    onMutate: async ({ userId, role }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ["team-members", tenantId] });

      // Snapshot
      const previousMembers = queryClient.getQueryData<TeamMember[]>(["team-members", tenantId]);

      // Optimistic update: update role
      if (previousMembers) {
        queryClient.setQueryData<TeamMember[]>(
          ["team-members", tenantId],
          previousMembers.map((member) => (member.id === userId ? { ...member, role } : member))
        );
      }

      return { previousMembers };
    },

    onError: (_error, _variables, context) => {
      // Rollback
      if (context?.previousMembers) {
        queryClient.setQueryData(["team-members", tenantId], context.previousMembers);
      }
    },

    onSuccess: () => {
      // Invalidate team members to refetch with new role - force refetch even if stale time hasn't passed
      queryClient.invalidateQueries({
        queryKey: ["team-members", tenantId],
        refetchType: "active",
      });
    },
  });
}

/**
 * Hook to get current user's role in the current tenant
 * Returns the role by finding current user in the team members list
 */
export function useCurrentUserRole() {
  const { data: currentUser } = useUser();
  const { data: teamMembers, isLoading } = useTeamMembers();

  const currentUserMember = teamMembers?.find((member) => member.id === currentUser?.id);

  return {
    role: currentUserMember?.role || null,
    isLoading,
    isOwner: currentUserMember?.role === "owner",
    isAdmin: currentUserMember?.role === "admin",
    isCurator: currentUserMember?.role === "curator",
    isUser: currentUserMember?.role === "user",
    canManageTeam: currentUserMember?.role === "owner" || currentUserMember?.role === "admin",
    canEditChatbots:
      currentUserMember?.role === "owner" ||
      currentUserMember?.role === "admin" ||
      currentUserMember?.role === "curator",
  };
}
