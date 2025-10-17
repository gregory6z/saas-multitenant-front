import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/lib/axios";

// Zod schemas for subscription validation
const SubscriptionSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  planId: z.string(),
  externalId: z.string().nullable(),
  status: z.enum([
    "active",
    "canceled",
    "incomplete",
    "incomplete_expired",
    "past_due",
    "trialing",
    "unpaid",
  ]),
  currentPeriodStart: z.string(),
  currentPeriodEnd: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const ExternalDetailsSchema = z.object({
  id: z.string(),
  status: z.string(),
  customer: z.string(),
  items: z
    .object({
      data: z.array(
        z.object({
          id: z.string(),
          price: z.object({
            id: z.string(),
            product: z.string(),
          }),
        })
      ),
    })
    .optional(), // items é opcional, pode não vir na resposta de change-plan
});

const SubscriptionResponseSchema = z.object({
  subscription: SubscriptionSchema,
  externalDetails: ExternalDetailsSchema.optional(),
});

// Checkout session schemas
const CreateCheckoutSessionSchema = z.object({
  planId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  customerEmail: z.string().email().optional(),
});

const CheckoutSessionResponseSchema = z.object({
  url: z.string().url(),
  sessionId: z.string(),
});

// Cancel subscription schema
const CancelSubscriptionSchema = z.object({
  cancelAtPeriodEnd: z.boolean().default(true),
});

// Portal session schema
const CreatePortalSessionSchema = z.object({
  returnUrl: z.string().url(),
});

const PortalSessionResponseSchema = z.object({
  url: z.string().url(),
});

// Change plan schema
const ChangePlanSchema = z.object({
  newPlanId: z.string().min(1, "ID do plano é obrigatório"),
});

// Preview plan change schema
const PreviewPlanChangeSchema = z.object({
  newPlanId: z.string().min(1, "ID do plano é obrigatório"),
});

const PreviewPlanChangeResponseSchema = z.object({
  currentPlan: z.object({
    id: z.string(),
    price: z.number(),
    interval: z.enum(["month", "year"]),
  }),
  newPlan: z.object({
    id: z.string(),
    price: z.number(),
    interval: z.enum(["month", "year"]),
  }),
  proration: z.object({
    creditAmount: z.number(),
    amountDue: z.number(),
    nextInvoiceAmount: z.number(),
    proratedUntil: z.string(),
  }),
});

// Export types
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type ExternalDetails = z.infer<typeof ExternalDetailsSchema>;
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseSchema>;
export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionSchema>;
export type CheckoutSessionResponse = z.infer<typeof CheckoutSessionResponseSchema>;
export type CancelSubscriptionInput = z.infer<typeof CancelSubscriptionSchema>;
export type CreatePortalSessionInput = z.infer<typeof CreatePortalSessionSchema>;
export type PortalSessionResponse = z.infer<typeof PortalSessionResponseSchema>;
export type ChangePlanInput = z.infer<typeof ChangePlanSchema>;
export type PreviewPlanChangeInput = z.infer<typeof PreviewPlanChangeSchema>;
export type PreviewPlanChangeResponse = z.infer<typeof PreviewPlanChangeResponseSchema>;

/**
 * Hook para buscar subscription do tenant atual
 *
 * TanStack Query v5 optimizations:
 * - staleTime: 5min - subscription muda moderadamente
 * - gcTime: 30min - mantém em cache durante sessão
 * - retry: 1 - tentativa única para evitar delays
 * - refetchOnWindowFocus: true (padrão) - atualiza status ao retornar
 */
export function useSubscription() {
  const subscriptionQuery = useQuery({
    queryKey: ["subscription"],
    queryFn: async (): Promise<SubscriptionResponse> => {
      const response = await api.get("/subscriptions");
      console.log("[useSubscription] Resposta do backend:", response.data);
      console.log("[useSubscription] JSON completo:", JSON.stringify(response.data, null, 2));
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5min - subscription muda moderadamente
    gcTime: 30 * 60 * 1000, // 30min - mantém em cache durante sessão
    retry: 1, // Tentativa única para evitar delays
  });

  return {
    subscription: subscriptionQuery.data?.subscription,
    externalDetails: subscriptionQuery.data?.externalDetails,
    isLoading: subscriptionQuery.isLoading,
    isError: subscriptionQuery.isError,
    error: subscriptionQuery.error,
    refetch: subscriptionQuery.refetch,
  };
}

/**
 * Hook para criar checkout session do Stripe
 *
 * Cria uma sessão de checkout para upgrade/mudança de plano
 * Redireciona automaticamente para o Stripe Checkout
 */
export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async (data: CreateCheckoutSessionInput): Promise<CheckoutSessionResponse> => {
      const validatedData = CreateCheckoutSessionSchema.parse(data);
      const response = await api.post("/subscriptions/checkout", validatedData);
      return response.data;
    },
    onSuccess: (data) => {
      // Redireciona para o Stripe Checkout
      window.location.href = data.url;
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "Usuário deve estar associado a um tenant");
      } else if (status === 404) {
        toast.error("Plano não encontrado");
      } else if (status === 409) {
        toast.error(
          message ||
            "Não foi possível processar a mudança de plano. O backend precisa suportar upgrade/downgrade de planos ativos."
        );
      } else {
        toast.error(message || "Erro ao criar sessão de checkout");
      }
    },
  });
}

/**
 * Hook para cancelar subscription
 *
 * Cancela a assinatura do tenant atual
 * Por padrão, cancela ao final do período atual
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data?: CancelSubscriptionInput): Promise<SubscriptionResponse> => {
      const validatedData = CancelSubscriptionSchema.parse(data || {});
      const response = await api.post("/subscriptions/cancel", validatedData);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Assinatura cancelada com sucesso");
      await queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404) {
        toast.error("Assinatura não encontrada");
      } else {
        toast.error(message || "Erro ao cancelar assinatura");
      }
    },
  });
}

/**
 * Hook para criar portal session do Stripe
 *
 * Cria uma sessão do Customer Portal para gerenciar assinatura
 * Permite alterar método de pagamento, ver faturas, etc.
 */
export function useCreatePortalSession() {
  return useMutation({
    mutationFn: async (data: CreatePortalSessionInput): Promise<PortalSessionResponse> => {
      const validatedData = CreatePortalSessionSchema.parse(data);
      const response = await api.post("/subscriptions/portal", validatedData);
      return response.data;
    },
    onSuccess: (data) => {
      // Redireciona para o Stripe Customer Portal
      window.location.href = data.url;
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404) {
        toast.error("Assinatura não encontrada");
      } else {
        toast.error(message || "Erro ao criar sessão do portal");
      }
    },
  });
}

/**
 * Hook para fazer upgrade/downgrade de plano
 *
 * Atualiza o plano da assinatura atual
 * Funciona com proration (cobra/credita diferença proporcional)
 */
export function useChangePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ChangePlanInput): Promise<SubscriptionResponse> => {
      const validatedData = ChangePlanSchema.parse(data);
      const response = await api.post("/subscriptions/change-plan", validatedData);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Plano atualizado com sucesso!");
      // Invalida subscription e plans para garantir dados sincronizados
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["subscription"] }),
        queryClient.invalidateQueries({ queryKey: ["plans"] }),
      ]);
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "Plano inválido ou igual ao atual");
      } else if (status === 403) {
        toast.error("Você não tem permissão para alterar o plano");
      } else if (status === 404) {
        toast.error("Assinatura não encontrada");
      } else {
        toast.error(message || "Erro ao alterar plano");
      }
    },
  });
}

/**
 * Hook para preview de mudança de plano
 *
 * Retorna informações sobre a mudança incluindo proration
 * Usado antes de confirmar a mudança de plano
 */
export function usePreviewPlanChange() {
  return useMutation({
    mutationFn: async (data: PreviewPlanChangeInput): Promise<PreviewPlanChangeResponse> => {
      const validatedData = PreviewPlanChangeSchema.parse(data);
      const response = await api.post("/subscriptions/preview-plan-change", validatedData);
      return response.data;
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "Não foi possível calcular o preview");
      } else if (status === 404) {
        toast.error("Assinatura ou plano não encontrado");
      } else {
        toast.error(message || "Erro ao calcular preview da mudança");
      }
    },
  });
}
