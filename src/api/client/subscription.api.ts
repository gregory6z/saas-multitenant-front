import { api } from "@/lib/axios";
import type {
  AddonsResponse,
  CancelSubscriptionRequest,
  ChangePlanRequest,
  CheckoutSessionResponse,
  CreateCheckoutSessionRequest,
  CreatePortalSessionRequest,
  PortalSessionResponse,
  PreviewPlanChangeRequest,
  PreviewPlanChangeResponse,
  SubscriptionResponse,
} from "../schemas/subscription.schema";

/**
 * Fetch current subscription
 */
export async function getSubscription(): Promise<SubscriptionResponse> {
  const { data } = await api.get<SubscriptionResponse>("/subscriptions");
  return data;
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(
  request: CreateCheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  const { data } = await api.post<CheckoutSessionResponse>("/subscriptions/checkout", request);
  return data;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  request: CancelSubscriptionRequest
): Promise<SubscriptionResponse> {
  const { data } = await api.post<SubscriptionResponse>("/subscriptions/cancel", request);
  return data;
}

/**
 * Create Stripe customer portal session
 */
export async function createPortalSession(
  request: CreatePortalSessionRequest
): Promise<PortalSessionResponse> {
  const { data } = await api.post<PortalSessionResponse>("/subscriptions/portal", request);
  return data;
}

/**
 * Change subscription plan
 */
export async function changePlan(request: ChangePlanRequest): Promise<SubscriptionResponse> {
  const { data } = await api.post<SubscriptionResponse>("/subscriptions/change-plan", request);
  return data;
}

/**
 * Preview plan change with proration details
 */
export async function previewPlanChange(
  request: PreviewPlanChangeRequest
): Promise<PreviewPlanChangeResponse> {
  const { data } = await api.post<PreviewPlanChangeResponse>(
    "/subscriptions/preview-plan-change",
    request
  );
  return data;
}

/**
 * Fetch available addons
 */
export async function getAddons(): Promise<AddonsResponse> {
  const { data } = await api.get<AddonsResponse>("/subscriptions/addons");
  return data;
}
