import { z } from "zod";

// =====================================
// 1. BASE SCHEMAS
// =====================================

/**
 * Subscription entity schema
 * Note: API returns minimal data - sensitive fields removed for security
 */
export const SubscriptionSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().optional(),
  planId: z.string(),
  externalId: z.string().nullable().optional(),
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
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
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

/**
 * Addon metadata schema
 * Contains addon-specific configuration (chatbots, storage_mb, kb_size_increase_mb, etc.)
 */
export const AddonMetadataSchema = z.object({
  chatbots: z.number().optional(),
  storage_mb: z.number().optional(),
  kb_size_increase_mb: z.number().optional(),
  messages: z.number().optional(),
  api_calls: z.number().optional(),
});

/**
 * Addon entity schema
 */
export const AddonSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  addonType: z.enum([
    "chatbot",
    "storage",
    "kb_size_upgrade",
    "messages",
    "api_calls",
    "user",
    "whitelabel",
    "custom_domain",
  ]),
  price: z.number(),
  interval: z.enum(["month", "year"]),
  currency: z.string(),
  metadata: AddonMetadataSchema.nullable(),
  sortOrder: z.number(),
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

/**
 * Add addon request
 */
export const AddAddonRequestSchema = z.object({
  addonId: z.string().min(1, "ID do addon é obrigatório"),
});

/**
 * Remove addon request
 */
export const RemoveAddonRequestSchema = z.object({
  addonId: z.string().min(1, "ID do addon é obrigatório"),
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
  billing: z
    .object({
      immediateChargeAmount: z.number(),
      immediateChargeDate: z.string(),
      nextBillingDate: z.string(),
      nextBillingAmount: z.number(),
    })
    .optional(),
  isUpgrade: z.boolean().optional(),
  isDowngrade: z.boolean().optional(),
});

/**
 * Get addons response
 */
export const AddonsResponseSchema = z.object({
  addons: z.array(AddonSchema),
});

/**
 * Add addon response
 */
export const AddAddonResponseSchema = z.object({
  subscriptionId: z.string(),
  addonAdded: z.object({
    id: z.string(),
    name: z.string(),
  }),
  prorationAmount: z.number(),
  message: z.string(),
});

/**
 * Remove addon response
 */
export const RemoveAddonResponseSchema = z.object({
  subscriptionId: z.string(),
  addonRemoved: z.object({
    id: z.string(),
    name: z.string(),
  }),
  message: z.string(),
});

// =====================================
// 4. TYPES
// =====================================

export type Subscription = z.infer<typeof SubscriptionSchema>;
export type ExternalDetails = z.infer<typeof ExternalDetailsSchema>;
export type AddonMetadata = z.infer<typeof AddonMetadataSchema>;
export type Addon = z.infer<typeof AddonSchema>;
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseSchema>;
export type CreateCheckoutSessionRequest = z.infer<typeof CreateCheckoutSessionRequestSchema>;
export type CheckoutSessionResponse = z.infer<typeof CheckoutSessionResponseSchema>;
export type CancelSubscriptionRequest = z.infer<typeof CancelSubscriptionRequestSchema>;
export type CreatePortalSessionRequest = z.infer<typeof CreatePortalSessionRequestSchema>;
export type PortalSessionResponse = z.infer<typeof PortalSessionResponseSchema>;
export type ChangePlanRequest = z.infer<typeof ChangePlanRequestSchema>;
export type PreviewPlanChangeRequest = z.infer<typeof PreviewPlanChangeRequestSchema>;
export type PreviewPlanChangeResponse = z.infer<typeof PreviewPlanChangeResponseSchema>;
export type AddonsResponse = z.infer<typeof AddonsResponseSchema>;
export type AddAddonRequest = z.infer<typeof AddAddonRequestSchema>;
export type AddAddonResponse = z.infer<typeof AddAddonResponseSchema>;
export type RemoveAddonRequest = z.infer<typeof RemoveAddonRequestSchema>;
export type RemoveAddonResponse = z.infer<typeof RemoveAddonResponseSchema>;
