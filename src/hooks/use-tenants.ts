import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { api } from "@/lib/axios";

// Zod schema for tenant validation
const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  subdomain: z.string(),
  status: z.enum(["active", "inactive"]).optional(), // Backend não retorna status no PUT /tenants
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const TenantsResponseSchema = z.object({
  tenants: z.array(TenantSchema),
});

const CreateTenantRequestSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  subdomain: z
    .string()
    .min(3, "Subdomínio deve ter pelo menos 3 caracteres")
    .max(63, "Subdomínio deve ter no máximo 63 caracteres")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Subdomínio deve conter apenas letras minúsculas, números e hífens"
    ),
});

const CreateTenantResponseSchema = z.object({
  tenant: TenantSchema,
});

const UpdateTenantRequestSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  subdomain: z
    .string()
    .min(3, "Subdomínio deve ter pelo menos 3 caracteres")
    .max(63, "Subdomínio deve ter no máximo 63 caracteres")
    .regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      "Subdomínio deve conter apenas letras minúsculas, números e hífens"
    )
    .refine(
      (value) => !value.startsWith("-") && !value.endsWith("-"),
      "Subdomínio não pode começar ou terminar com hífen"
    )
    .optional(),
});

const UpdateTenantResponseSchema = z.object({
  tenant: TenantSchema,
});

// Schemas para tenant invites
const JoinTenantRequestSchema = z.object({
  inviteCode: z.string().min(1, "Código de convite é obrigatório"),
});

const JoinTenantResponseSchema = z.object({
  tenant: TenantSchema,
  role: z.string(),
});

const CreateInviteRequestSchema = z.object({
  tenantId: z.string(),
  role: z.enum(["admin", "member"]).default("member"),
  expiresIn: z.number().default(7), // days
});

const CreateInviteResponseSchema = z.object({
  inviteCode: z.string(),
  expiresAt: z.string(),
});

const InviteSchema = z.object({
  id: z.string(),
  inviteCode: z.string(),
  tenantId: z.string(),
  role: z.string(),
  createdBy: z.string(),
  expiresAt: z.string(),
  createdAt: z.string(),
  usedAt: z.string().nullable(),
  usedBy: z.string().nullable(),
});

const InvitesResponseSchema = z.object({
  invites: z.array(InviteSchema),
});

// Export schemas for use in forms with zodResolver
export { UpdateTenantRequestSchema, CreateTenantRequestSchema };

export type Tenant = z.infer<typeof TenantSchema>;
export type TenantsResponse = z.infer<typeof TenantsResponseSchema>;
export type CreateTenantRequest = z.infer<typeof CreateTenantRequestSchema>;
export type CreateTenantResponse = z.infer<typeof CreateTenantResponseSchema>;
export type UpdateTenantRequest = z.infer<typeof UpdateTenantRequestSchema>;
export type UpdateTenantResponse = z.infer<typeof UpdateTenantResponseSchema>;
export type JoinTenantRequest = z.infer<typeof JoinTenantRequestSchema>;
export type JoinTenantResponse = z.infer<typeof JoinTenantResponseSchema>;
export type CreateInviteRequest = z.infer<typeof CreateInviteRequestSchema>;
export type CreateInviteResponse = z.infer<typeof CreateInviteResponseSchema>;
export type Invite = z.infer<typeof InviteSchema>;
export type InvitesResponse = z.infer<typeof InvitesResponseSchema>;

/**
 * Hook principal para gerenciar tenants - otimizado com TanStack Query v5 best practices
 *
 * Otimizações aplicadas:
 * - staleTime balanceado para evitar refetches desnecessários
 * - gcTime otimizado para manter dados em cache durante a sessão
 * - Retry strategy inteligente baseada no tipo de erro
 * - Optimistic updates completos com rollback
 * - Invalidação seletiva de queries
 */
export function useTenants() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query principal para listar tenants
  const tenantsQuery = useQuery({
    queryKey: ["tenants"],
    queryFn: async (): Promise<Tenant[]> => {
      const response = await api.get("/tenants");
      const validatedData = TenantsResponseSchema.parse(response.data);
      return validatedData.tenants;
    },
    // Otimizações baseadas nas docs da TanStack Query v5:
    //
    // staleTime: 5min - Dados de tenants mudam raramente, mas precisam estar atualizados
    // Evita refetches desnecessários mas mantém dados frescos o suficiente
    staleTime: 5 * 60 * 1000, // 5 minutos

    // gcTime: 30min - Mantém dados em cache durante toda a sessão do usuário
    // Permite navegação rápida sem refetches constantes
    gcTime: 30 * 60 * 1000, // 30 minutos

    // Retry strategy inteligente:
    // - Não tenta novamente em erros 4xx (client errors)
    // - Tenta até 2x em erros 5xx (server errors) ou problemas de rede
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      // Não retry em client errors (400-499)
      if (status && status >= 400 && status < 500) {
        return false;
      }
      // Retry até 2x em server errors ou network issues
      return failureCount < 2;
    },

    // networkMode: "online" - Só executa quando online
    networkMode: "online",

    // Refetch on window focus DESABILITADO para dados de tenant
    // Tenants não mudam frequentemente, não precisa refetch a cada tab focus
    refetchOnWindowFocus: false,

    // Refetch on mount: true (padrão) - Permite refetch se dados estiverem stale
    // Combinado com staleTime de 5min, evita refetches desnecessários
    refetchOnMount: true,

    // Polling desabilitado - Dados de tenant não precisam de updates em tempo real
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  // Mutation para criar tenant com optimistic updates
  const createTenant = useMutation({
    mutationFn: async (tenantData: CreateTenantRequest) => {
      const validatedData = CreateTenantRequestSchema.parse(tenantData);
      const response = await api.post("/tenants", validatedData);
      const validatedResponse = CreateTenantResponseSchema.parse(response.data);
      return validatedResponse.tenant;
    },

    // Optimistic update ANTES da mutation
    onMutate: async (newTenantData) => {
      // Cancela refetches em andamento para evitar race conditions
      await queryClient.cancelQueries({ queryKey: ["tenants"] });

      // Snapshot do estado anterior para rollback
      const previousTenants = queryClient.getQueryData<Tenant[]>(["tenants"]);

      // Optimistic update: adiciona tenant temporário
      const tempTenant: Tenant = {
        id: `temp-${Date.now()}`,
        name: newTenantData.name,
        subdomain: newTenantData.subdomain,
        status: "active",
        ownerId: "", // Será preenchido pelo backend
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Tenant[]>(["tenants"], (oldTenants) => {
        return oldTenants ? [...oldTenants, tempTenant] : [tempTenant];
      });

      // Retorna contexto para onError e onSuccess
      return { previousTenants };
    },

    // Rollback em caso de erro
    onError: (_error, _newTenantData, context) => {
      if (context?.previousTenants) {
        queryClient.setQueryData(["tenants"], context.previousTenants);
      }
    },

    // Atualiza com dados reais do servidor
    onSuccess: (newTenant, _variables, _context) => {
      // Remove optimistic update e adiciona dados reais
      queryClient.setQueryData<Tenant[]>(["tenants"], (oldTenants) => {
        if (!oldTenants) return [newTenant];

        // Remove tenant temporário e adiciona o real
        const withoutTemp = oldTenants.filter(t => !t.id.startsWith("temp-"));
        return [...withoutTemp, newTenant];
      });

      // Redirect após criação bem-sucedida
      const currentHost = window.location.host;

      if (currentHost.includes("localhost")) {
        // Development: Não usa subdomains
        console.log("Development mode: redirecting to dashboard after tenant creation");
        navigate({ to: "/dashboard/chatbots" });
      } else {
        // Production: Redireciona para subdomain do tenant
        const protocol = window.location.protocol;
        const subdomainUrl = `${protocol}//${newTenant.subdomain}.multisaas.app/dashboard/chatbots`;

        console.log("Production mode: redirecting to tenant subdomain:", subdomainUrl);
        window.location.href = subdomainUrl;
      }
    },

    // Retry strategy para mutations
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      // Nunca retry em erros 4xx (validação, duplicação, etc)
      if (status && status >= 400 && status < 500) {
        return false;
      }
      // Retry 1x em erros 5xx
      return failureCount < 1;
    },
  });

  // Mutation para atualizar tenant com optimistic updates
  const updateTenant = useMutation({
    mutationFn: async ({ data }: { id: string; data: UpdateTenantRequest }) => {
      const validatedData = UpdateTenantRequestSchema.parse(data);
      // Backend extrai tenant do Origin header automaticamente (lvh.me)
      const response = await api.put(`/tenants`, validatedData);
      const validatedResponse = UpdateTenantResponseSchema.parse(response.data);
      return validatedResponse.tenant;
    },

    onMutate: async ({ id, data }) => {
      // Cancela refetches para evitar race conditions
      await queryClient.cancelQueries({ queryKey: ["tenants"] });
      await queryClient.cancelQueries({ queryKey: ["tenant", id] });

      // Snapshot do estado anterior
      const previousTenants = queryClient.getQueryData<Tenant[]>(["tenants"]);
      const previousTenant = queryClient.getQueryData<Tenant>(["tenant", id]);

      // Optimistic update na lista de tenants
      if (previousTenants) {
        const updatedTenants = previousTenants.map((tenant) =>
          tenant.id === id
            ? { ...tenant, ...data, updatedAt: new Date().toISOString() }
            : tenant
        );
        queryClient.setQueryData(["tenants"], updatedTenants);
      }

      // Optimistic update no tenant individual
      if (previousTenant) {
        queryClient.setQueryData(["tenant", id], {
          ...previousTenant,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousTenants, previousTenant };
    },

    onError: (_error, { id }, context) => {
      // Rollback completo
      if (context?.previousTenants) {
        queryClient.setQueryData(["tenants"], context.previousTenants);
      }
      if (context?.previousTenant) {
        queryClient.setQueryData(["tenant", id], context.previousTenant);
      }
    },

    onSuccess: (updatedTenant, variables) => {
      // Atualiza com dados reais do servidor (sem invalidação desnecessária)
      queryClient.setQueryData(["tenant", updatedTenant.id], updatedTenant);

      queryClient.setQueryData<Tenant[]>(["tenants"], (oldTenants) => {
        if (!oldTenants) return [updatedTenant];
        return oldTenants.map((tenant) =>
          tenant.id === updatedTenant.id ? updatedTenant : tenant
        );
      });

      // Verifica se estamos em um subdomain e se mudou
      const currentHostname = window.location.hostname;
      const currentSubdomain = currentHostname.split('.')[0];

      // Se subdomain foi alterado E estamos em subdomain, redireciona
      if (
        variables.data.subdomain &&
        currentHostname.includes('.') &&
        currentSubdomain !== updatedTenant.subdomain
      ) {
        // Constrói nova URL com novo subdomain
        const protocol = window.location.protocol;
        const port = window.location.port ? `:${window.location.port}` : '';
        const pathname = window.location.pathname;
        const search = window.location.search;
        const hash = window.location.hash;

        // Detecta domínio base (lvh.me, multisaas.app, localhost)
        let baseDomain = 'lvh.me';
        if (currentHostname.includes('multisaas.app')) {
          baseDomain = 'multisaas.app';
        } else if (currentHostname.includes('localhost')) {
          baseDomain = 'localhost';
        } else if (currentHostname.includes('lvh.me')) {
          baseDomain = 'lvh.me';
        }

        const newUrl = `${protocol}//${updatedTenant.subdomain}.${baseDomain}${port}${pathname}${search}${hash}`;

        console.log('[UpdateTenant] Subdomain changed, redirecting to:', newUrl);

        // Aguarda um pouco para garantir que cache foi atualizado
        setTimeout(() => {
          window.location.href = newUrl;
        }, 500);
      }
    },

    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        return false;
      }
      return failureCount < 1;
    },
  });

  // NOTA: Endpoint DELETE /tenants/{id} NÃO existe no backend
  // O único DELETE disponível é DELETE /tenants/users/{userId} para remover usuários
  // Se precisar deletar tenant, endpoint precisa ser implementado no backend primeiro

  // Mutation placeholder - não funcional até backend implementar endpoint
  const deleteTenant = useMutation({
    mutationFn: async (_id: string): Promise<void> => {
      throw new Error("Endpoint DELETE /tenants não implementado no backend. Use a UI para deletar o tenant.");
    },

    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["tenants"] });
      const previousTenants = queryClient.getQueryData<Tenant[]>(["tenants"]);

      queryClient.setQueryData<Tenant[]>(["tenants"], (oldTenants) => {
        if (!oldTenants) return [];
        return oldTenants.filter((tenant) => tenant.id !== deletedId);
      });

      return { previousTenants };
    },

    onError: (_error, _deletedId, context) => {
      if (context?.previousTenants) {
        queryClient.setQueryData(["tenants"], context.previousTenants);
      }
    },

    onSuccess: (_data, deletedId) => {
      queryClient.removeQueries({
        queryKey: ["tenant", deletedId],
      });
    },

    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        return false;
      }
      return failureCount < 1;
    },
  });

  // Mutation para juntar-se a tenant via convite
  const joinTenant = useMutation({
    mutationFn: async (data: JoinTenantRequest): Promise<JoinTenantResponse> => {
      const validatedData = JoinTenantRequestSchema.parse(data);
      const response = await api.post("/tenants/join", validatedData);
      const validatedResponse = JoinTenantResponseSchema.parse(response.data);
      return validatedResponse;
    },

    onSuccess: (result) => {
      // Invalida cache de tenants para forçar refetch com novo tenant
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      // Redirect para o tenant recém-adicionado
      const currentHost = window.location.host;

      if (currentHost.includes("localhost")) {
        console.log("Development mode: redirecting to dashboard after joining tenant");
        navigate({ to: "/dashboard/chatbots" });
      } else {
        const protocol = window.location.protocol;
        const subdomainUrl = `${protocol}//${result.tenant.subdomain}.multisaas.app/dashboard/chatbots`;

        console.log("Production mode: redirecting to joined tenant:", subdomainUrl);
        window.location.href = subdomainUrl;
      }
    },

    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      // Não retry em códigos inválidos ou expirados (400-499)
      if (status && status >= 400 && status < 500) {
        return false;
      }
      return failureCount < 1;
    },
  });

  // Mutation para criar convite
  const createInvite = useMutation({
    mutationFn: async (data: CreateInviteRequest): Promise<CreateInviteResponse> => {
      const validatedData = CreateInviteRequestSchema.parse(data);
      const response = await api.post("/tenants/invites", validatedData);
      const validatedResponse = CreateInviteResponseSchema.parse(response.data);
      return validatedResponse;
    },

    onSuccess: (_data, variables) => {
      // Invalida apenas os invites do tenant específico
      queryClient.invalidateQueries({
        queryKey: ["tenant-invites", variables.tenantId],
      });
    },

    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        return false;
      }
      return failureCount < 1;
    },
  });

  // Mutation para revogar convite
  const revokeInvite = useMutation({
    mutationFn: async (inviteId: string): Promise<void> => {
      await api.delete(`/tenants/invites/${inviteId}`);
    },

    onSuccess: () => {
      // Invalida todos os invites (não sabemos qual tenant)
      // Alternativa: passar tenantId como parâmetro para invalidação seletiva
      queryClient.invalidateQueries({
        queryKey: ["tenant-invites"],
      });
    },

    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        return false;
      }
      return failureCount < 1;
    },
  });

  // Funções helper para acessar dados do cache
  const getTenant = (id: string) => {
    return queryClient.getQueryData<Tenant>(["tenant", id]) || null;
  };

  const getTenantInvites = (tenantId: string) => {
    return queryClient.getQueryData<Invite[]>(["tenant-invites", tenantId]) || [];
  };

  return {
    // Query data e states
    tenants: tenantsQuery.data,
    isLoading: tenantsQuery.isLoading,
    error: tenantsQuery.error,
    isError: tenantsQuery.isError,

    // Export da query completa para uso avançado
    tenantsQuery,

    // Helper functions
    getTenant,
    getTenantInvites,

    // Mutations
    createTenant,
    updateTenant,
    deleteTenant,
    joinTenant,
    createInvite,
    revokeInvite,
  };
}
