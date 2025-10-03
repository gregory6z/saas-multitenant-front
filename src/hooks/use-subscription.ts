import { useQuery } from "@tanstack/react-query";
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
  status: z.string(),
  customer: z.string(),
  items: z.object({
    data: z.array(
      z.object({
        id: z.string(),
        price: z.object({
          id: z.string(),
          product: z.string(),
        }),
      })
    ),
  }),
});

const SubscriptionResponseSchema = z.object({
  subscription: SubscriptionSchema,
  externalDetails: ExternalDetailsSchema.optional(),
});

// Export types
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type ExternalDetails = z.infer<typeof ExternalDetailsSchema>;
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseSchema>;

/**
 * Hook para buscar subscription do tenant atual
 */
export function useSubscription() {
  const subscriptionQuery = useQuery({
    queryKey: ["subscription"],
    queryFn: async (): Promise<SubscriptionResponse> => {
      const response = await api.get("/subscriptions");
      return SubscriptionResponseSchema.parse(response.data);
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
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
