import { useQuery } from "@tanstack/react-query";
import { getSubscription } from "@/api/client/subscription.api";
import { SubscriptionResponseSchema } from "@/api/schemas/subscription.schema";

/**
 * Query hook to fetch current subscription
 *
 * TanStack Query v5 optimizations:
 * - staleTime: 5min - subscription changes moderately
 * - gcTime: 30min - keep in cache during session
 * - retry: 1 - single attempt to avoid delays
 * - refetchOnWindowFocus: true (default) - refresh status on return
 */
export function useSubscriptionQuery() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const response = await getSubscription();
      console.log("[useSubscriptionQuery] Backend response:", response);
      console.log("[useSubscriptionQuery] Full JSON:", JSON.stringify(response, null, 2));
      // Validate response with Zod schema
      return SubscriptionResponseSchema.parse(response);
    },
    staleTime: 5 * 60 * 1000, // 5min - subscription changes moderately
    gcTime: 30 * 60 * 1000, // 30min - keep in cache during session
    retry: 1, // Single attempt to avoid delays
  });
}
