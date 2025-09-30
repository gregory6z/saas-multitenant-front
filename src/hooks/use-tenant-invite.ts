import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { api } from "@/lib/axios";

// Schema for joining a tenant via invite code
const JoinTenantRequestSchema = z.object({
  inviteCode: z.string().min(1, "Código de convite é obrigatório"),
});

const JoinTenantResponseSchema = z.object({
  tenant: z.object({
    id: z.string(),
    name: z.string(),
    subdomain: z.string(),
    status: z.enum(["active", "inactive"]),
  }),
  role: z.string(),
});

export type JoinTenantRequest = z.infer<typeof JoinTenantRequestSchema>;
export type JoinTenantResponse = z.infer<typeof JoinTenantResponseSchema>;

/**
 * Hook to join a tenant using an invite code
 */
export function useJoinTenant() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: JoinTenantRequest): Promise<JoinTenantResponse> => {
      const validatedData = JoinTenantRequestSchema.parse(data);
      const response = await api.post("/tenants/join", validatedData);
      const validatedResponse = JoinTenantResponseSchema.parse(response.data);
      return validatedResponse;
    },
    onSuccess: (result) => {
      // Invalidate tenants cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      
      // Redirect to the new tenant
      const currentHost = window.location.host;
      
      if (currentHost.includes("localhost")) {
        // Development: Don't use subdomains, just go to dashboard
        console.log("Development mode: redirecting to dashboard after joining tenant");
        navigate({ to: "/dashboard/chatbots" });
      } else {
        // Production: redirect to tenant's subdomain
        const protocol = window.location.protocol;
        const subdomainUrl = `${protocol}//${result.tenant.subdomain}.multisaas.app/dashboard/chatbots`;
        
        console.log("Production mode: redirecting to joined tenant:", subdomainUrl);
        window.location.href = subdomainUrl;
      }
    },
    onError: (error) => {
      console.error("Erro ao juntar-se ao tenant:", error);
    },
  });
}

// Schema for creating an invite for a tenant
const CreateInviteRequestSchema = z.object({
  tenantId: z.string(),
  role: z.enum(["admin", "member"]).default("member"),
  expiresIn: z.number().default(7), // days
});

const CreateInviteResponseSchema = z.object({
  inviteCode: z.string(),
  expiresAt: z.string(),
});

export type CreateInviteRequest = z.infer<typeof CreateInviteRequestSchema>;
export type CreateInviteResponse = z.infer<typeof CreateInviteResponseSchema>;

/**
 * Hook to create an invite code for a tenant
 */
export function useCreateInvite() {
  return useMutation({
    mutationFn: async (data: CreateInviteRequest): Promise<CreateInviteResponse> => {
      const validatedData = CreateInviteRequestSchema.parse(data);
      const response = await api.post("/tenants/invites", validatedData);
      const validatedResponse = CreateInviteResponseSchema.parse(response.data);
      return validatedResponse;
    },
    onError: (error) => {
      console.error("Erro ao criar convite:", error);
    },
  });
}