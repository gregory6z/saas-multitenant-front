import { useQuery } from "@tanstack/react-query";
import { getPlans } from "@/api/client/plan.api";
import { PlansResponseSchema } from "@/api/schemas/plan.schema";

/**
 * Query hook to fetch all available subscription plans
 */
export function usePlansQuery() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await getPlans();
      // Validate response with Zod schema
      const validated = PlansResponseSchema.parse(response);
      return validated.plans;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
}
