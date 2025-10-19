import { useQuery } from "@tanstack/react-query";
import { getAddons } from "@/api/client/subscription.api";
import { AddonsResponseSchema } from "@/api/schemas/subscription.schema";

/**
 * Query hook to fetch available addons
 *
 * TanStack Query v5 optimizations:
 * - staleTime: 10min - addons rarely change
 * - gcTime: 30min - keep in cache during session
 * - retry: 1 - single attempt to avoid delays
 */
export function useAddonsQuery() {
  return useQuery({
    queryKey: ["addons"],
    queryFn: async () => {
      const response = await getAddons();
      console.log("[useAddonsQuery] Backend response:", response);
      // Validate response with Zod schema
      const validated = AddonsResponseSchema.parse(response);
      console.log("[useAddonsQuery] ✅ Validated response:", validated);
      return validated;
    },
    staleTime: 10 * 60 * 1000, // 10min - addons rarely change
    gcTime: 30 * 60 * 1000, // 30min - keep in cache during session
    retry: 1, // Single attempt to avoid delays
  });
}
