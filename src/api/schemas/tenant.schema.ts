import type { TFunction } from "i18next";
import { z } from "zod";

/**
 * Tenant Schemas
 * Zod schemas for tenant operations with runtime validation
 */

// ============================================================================
// BASE SCHEMAS (used by other schemas)
// ============================================================================

export const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  subdomain: z.string(),
  status: z.enum(["active", "inactive"]).optional(),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================================================
// REQUEST SCHEMAS (factory functions with i18n for forms)
// ============================================================================

export const createTenantRequestSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t("errors.nameRequired")),
    subdomain: z
      .string()
      .transform((val) =>
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      )
      .pipe(
        z
          .string()
          .min(3, t("errors.subdomainMinLength"))
          .max(63, t("errors.subdomainMaxLength"))
          .regex(
            /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
            t("errors.subdomainFormat")
          )
          .refine(
            (value) => !value.startsWith("-") && !value.endsWith("-"),
            t("errors.subdomainHyphens")
          )
      ),
  });

export const updateTenantRequestSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t("errors.nameRequired")).optional(),
    subdomain: z
      .string()
      .transform((val) =>
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      )
      .pipe(
        z
          .string()
          .min(3, t("errors.subdomainMinLength"))
          .max(63, t("errors.subdomainMaxLength"))
          .regex(
            /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
            t("errors.subdomainInvalid"))
          .refine(
            (value) => !value.startsWith("-") && !value.endsWith("-"),
            t("errors.subdomainEdges")
          )
      )
      .optional(),
  });

export const joinTenantRequestSchema = (t: TFunction) =>
  z.object({
    inviteCode: z
      .string()
      .min(1, t("errors.inviteCodeRequired"))
      .regex(/^[A-Z0-9]{6,12}$/, t("errors.inviteCodeFormat")),
  });

export const TransferOwnershipRequestSchema = z.object({
  newOwnerId: z.string().uuid("Invalid owner ID"),
});

// ============================================================================
// RESPONSE SCHEMAS (constant schemas - no i18n needed)
// ============================================================================

export const TenantsResponseSchema = z.object({
  tenants: z.array(TenantSchema),
});

export const CreateTenantResponseSchema = z.object({
  tenant: TenantSchema,
});

export const UpdateTenantResponseSchema = z.object({
  tenant: TenantSchema,
});

export const JoinTenantResponseSchema = z.object({
  tenant: TenantSchema,
  role: z.string(),
});

export const TransferOwnershipResponseSchema = z.object({
  success: z.boolean(),
  previousOwnerId: z.string(),
  newOwnerId: z.string(),
  message: z.string(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Tenant = z.infer<typeof TenantSchema>;
export type TenantsResponse = z.infer<typeof TenantsResponseSchema>;

// Request types (from factory functions)
export type CreateTenantRequest = z.infer<ReturnType<typeof createTenantRequestSchema>>;
export type UpdateTenantRequest = z.infer<ReturnType<typeof updateTenantRequestSchema>>;
export type JoinTenantRequest = z.infer<ReturnType<typeof joinTenantRequestSchema>>;
export type TransferOwnershipRequest = z.infer<typeof TransferOwnershipRequestSchema>;

// Response types
export type CreateTenantResponse = z.infer<typeof CreateTenantResponseSchema>;
export type UpdateTenantResponse = z.infer<typeof UpdateTenantResponseSchema>;
export type JoinTenantResponse = z.infer<typeof JoinTenantResponseSchema>;
export type TransferOwnershipResponse = z.infer<typeof TransferOwnershipResponseSchema>;
