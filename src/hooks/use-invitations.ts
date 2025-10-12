import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useCurrentTenantId } from "@/hooks/use-current-tenant";
import { api } from "@/lib/axios";

// Invitation schema
const InvitationSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(["owner", "admin", "curator", "user"]),
  status: z.enum(["pending", "accepted", "revoked", "expired"]),
  createdAt: z.string(),
  expiresAt: z.string().optional(),
  acceptedAt: z.string().nullable().optional(),
});

const InvitationsResponseSchema = z.object({
  invitations: z.array(InvitationSchema),
});

const CreateInvitationRequestSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["owner", "admin", "curator", "user"]).default("user"),
});

export type Invitation = z.infer<typeof InvitationSchema>;
export type CreateInvitationRequest = z.infer<typeof CreateInvitationRequestSchema>;

/**
 * Hook to fetch invitations for current tenant
 */
export function useInvitations() {
  const tenantId = useCurrentTenantId();

  return useQuery({
    queryKey: ["invitations", tenantId],
    queryFn: async (): Promise<Invitation[]> => {
      const response = await api.get("/invitations");
      const validated = InvitationsResponseSchema.parse(response.data);
      return validated.invitations;
    },
    enabled: !!tenantId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new invitation
 */
export function useCreateInvitation() {
  const queryClient = useQueryClient();
  const tenantId = useCurrentTenantId();

  return useMutation({
    mutationFn: async (data: CreateInvitationRequest): Promise<Invitation> => {
      const validated = CreateInvitationRequestSchema.parse(data);
      const response = await api.post("/invitations", validated);
      return InvitationSchema.parse(response.data.invitation || response.data);
    },

    onSuccess: (newInvitation) => {
      // Optimistically add new invitation to list
      queryClient.setQueryData<Invitation[]>(["invitations", tenantId], (old) => {
        return old ? [...old, newInvitation] : [newInvitation];
      });

      // Invalidate to refetch and ensure consistency
      queryClient.invalidateQueries({ queryKey: ["invitations", tenantId] });
    },
  });
}

/**
 * Hook to accept an invitation
 */
export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string): Promise<void> => {
      await api.post(`/invitations/${invitationId}/accept`);
    },

    onSuccess: () => {
      // Refetch invitations and tenants after accepting
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
}

/**
 * Hook to revoke an invitation
 */
export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  const tenantId = useCurrentTenantId();

  return useMutation({
    mutationFn: async (invitationId: string): Promise<void> => {
      await api.delete(`/invitations/${invitationId}`);
    },

    onMutate: async (invitationId) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ["invitations", tenantId] });

      // Snapshot
      const previousInvitations = queryClient.getQueryData<Invitation[]>(["invitations", tenantId]);

      // Optimistic update: mark as revoked
      if (previousInvitations) {
        queryClient.setQueryData<Invitation[]>(
          ["invitations", tenantId],
          previousInvitations.map((inv) =>
            inv.id === invitationId ? { ...inv, status: "revoked" as const } : inv
          )
        );
      }

      return { previousInvitations };
    },

    onError: (_error, _invitationId, context) => {
      // Rollback
      if (context?.previousInvitations) {
        queryClient.setQueryData(["invitations", tenantId], context.previousInvitations);
      }
    },

    onSuccess: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["invitations", tenantId] });
    },
  });
}

/**
 * Hook to resend an invitation email
 */
export function useResendInvitation() {
  const queryClient = useQueryClient();
  const tenantId = useCurrentTenantId();

  return useMutation({
    mutationFn: async (invitationId: string): Promise<void> => {
      await api.post(`/invitations/${invitationId}/resend`);
    },

    onSuccess: () => {
      // Invalidate to refetch (may update timestamps)
      queryClient.invalidateQueries({ queryKey: ["invitations", tenantId] });
    },
  });
}
