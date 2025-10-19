import { z } from "zod";

// =====================================
// 1. BASE SCHEMAS
// =====================================

/**
 * Subscription entity schema
 */
export const SubscriptionSchema = z.object({
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

/**
 * External subscription details from Stripe
 */
export const ExternalDetailsSchema = z.object({
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

// =====================================
// 2. REQUEST SCHEMAS (constant - not used in forms)
// =====================================

/**
 * Create checkout session request
 */
export const CreateCheckoutSessionRequestSchema = z.object({
  planId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  customerEmail: z.string().email().optional(),
});

/**
 * Cancel subscription request
 */
export const CancelSubscriptionRequestSchema = z.object({
  cancelAtPeriodEnd: z.boolean().default(true),
});

/**
 * Create portal session request
 */
export const CreatePortalSessionRequestSchema = z.object({
  returnUrl: z.string().url(),
});

/**
 * Change plan request
 */
export const ChangePlanRequestSchema = z.object({
  newPlanId: z.string().min(1, "ID do plano é obrigatório"),
});

/**
 * Preview plan change request
 */
export const PreviewPlanChangeRequestSchema = z.object({
  newPlanId: z.string().min(1, "ID do plano é obrigatório"),
});

// =====================================
// 3. RESPONSE SCHEMAS
// =====================================

/**
 * Subscription response with external details
 */
export const SubscriptionResponseSchema = z.object({
  subscription: SubscriptionSchema,
  externalDetails: ExternalDetailsSchema.optional(),
});

/**
 * Checkout session response
 */
export const CheckoutSessionResponseSchema = z.object({
  url: z.string().url(),
  sessionId: z.string(),
});

/**
 * Portal session response
 */
export const PortalSessionResponseSchema = z.object({
  url: z.string().url(),
});

/**
 * Preview plan change response
 */
export const PreviewPlanChangeResponseSchema = z.object({
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

// =====================================
// 4. TYPES
// =====================================

export type Subscription = z.infer<typeof SubscriptionSchema>;
export type ExternalDetails = z.infer<typeof ExternalDetailsSchema>;
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseSchema>;
export type CreateCheckoutSessionRequest = z.infer<typeof CreateCheckoutSessionRequestSchema>;
export type CheckoutSessionResponse = z.infer<typeof CheckoutSessionResponseSchema>;
export type CancelSubscriptionRequest = z.infer<typeof CancelSubscriptionRequestSchema>;
export type CreatePortalSessionRequest = z.infer<typeof CreatePortalSessionRequestSchema>;
export type PortalSessionResponse = z.infer<typeof PortalSessionResponseSchema>;
export type ChangePlanRequest = z.infer<typeof ChangePlanRequestSchema>;
export type PreviewPlanChangeRequest = z.infer<typeof PreviewPlanChangeRequestSchema>;
export type PreviewPlanChangeResponse = z.infer<typeof PreviewPlanChangeResponseSchema>;
