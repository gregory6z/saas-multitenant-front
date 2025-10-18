import { z } from "zod";

/**
 * Tenant Schemas
 * Zod schemas for tenant operations with runtime validation
 */

// Base tenant schema
export const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  subdomain: z.string(),
  status: z.enum(["active", "inactive"]).optional(),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Response schemas
export const TenantsResponseSchema = z.object({
  tenants: z.array(TenantSchema),
});

export const UpdateTenantResponseSchema = z.object({
  tenant: TenantSchema,
});

// Request schemas
export const UpdateTenantRequestSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  subdomain: z
    .string()
    .transform(
      (val) =>
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/-+/g, "-") // Replace multiple hyphens with single
          .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    )
    .pipe(
      z
        .string()
        .min(3, "Subdomínio deve ter pelo menos 3 caracteres")
        .max(63, "Subdomínio deve ter no máximo 63 caracteres")
        .regex(
          /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
          "Subdomínio deve conter apenas letras minúsculas, números e hífens"
        )
        .refine(
          (value) => !value.startsWith("-") && !value.endsWith("-"),
          "Subdomínio não pode começar ou terminar com hífen"
        )
    )
    .optional(),
});

// Transfer ownership schemas
export const TransferOwnershipRequestSchema = z.object({
  newOwnerId: z.string().uuid("ID do novo proprietário inválido"),
});

export const TransferOwnershipResponseSchema = z.object({
  success: z.boolean(),
  previousOwnerId: z.string(),
  newOwnerId: z.string(),
  message: z.string(),
});

// Type exports
export type Tenant = z.infer<typeof TenantSchema>;
export type TenantsResponse = z.infer<typeof TenantsResponseSchema>;
export type UpdateTenantRequest = z.infer<typeof UpdateTenantRequestSchema>;
export type UpdateTenantResponse = z.infer<typeof UpdateTenantResponseSchema>;
export type TransferOwnershipRequest = z.infer<typeof TransferOwnershipRequestSchema>;
export type TransferOwnershipResponse = z.infer<typeof TransferOwnershipResponseSchema>;
