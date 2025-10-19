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
      console.log("[useSubscriptionQuery] Response type:", typeof response);
      console.log("[useSubscriptionQuery] Has subscription key:", "subscription" in (response || {}));
      console.log("[useSubscriptionQuery] Full JSON:", JSON.stringify(response, null, 2));

      // If API returns subscription directly (not wrapped), wrap it
      if (response && "planId" in response && !("subscription" in response)) {
        console.log("[useSubscriptionQuery] ⚠️ API returned subscription directly, wrapping it");
        const wrapped = { subscription: response };
        return SubscriptionResponseSchema.parse(wrapped);
      }

      // Validate response with Zod schema
      const validated = SubscriptionResponseSchema.parse(response);
      console.log("[useSubscriptionQuery] ✅ Validated response:", validated);
      return validated;
    },
    staleTime: 5 * 60 * 1000, // 5min - subscription changes moderately
    gcTime: 30 * 60 * 1000, // 30min - keep in cache during session
    retry: 1, // Single attempt to avoid delays
  });
}
