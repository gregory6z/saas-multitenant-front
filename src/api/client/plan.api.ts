import api from "@/lib/axios";
import type { PlansResponse } from "../schemas/plan.schema";

/**
 * Fetch all available subscription plans
 */
export async function getPlans(): Promise<PlansResponse> {
  const { data } = await api.get<PlansResponse>("/subscriptions/plans");
  return data;
}
