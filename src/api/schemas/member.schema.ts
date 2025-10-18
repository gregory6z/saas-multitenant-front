import { z } from "zod";
import { TenantUserSchema } from "@/lib/schemas/users";

/**
 * Member Schemas
 * Zod schemas for team member operations with runtime validation
 * Roles: owner (full access), admin (manage team/bots), curator (edit bots), user (view only)
 */

// ============================================================================
// BASE SCHEMAS (used by other schemas)
// ============================================================================

/**
 * Member Schema - Re-export do TenantUserSchema existente
 */
export const MemberSchema = TenantUserSchema;

/**
 * Invitation Schema - Convite pendente para um membro
 */
export const InvitationSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(["owner", "admin", "curator", "user"]),
  status: z.enum(["pending", "accepted", "revoked", "expired"]),
  createdAt: z.string(),
  expiresAt: z.string().optional(),
  acceptedAt: z.string().nullable().optional(),
});

// ============================================================================
// REQUEST SCHEMAS (constant schemas - NOT used in forms)
// ============================================================================
// NOTE: These schemas are NOT used in React Hook Form components.
// Forms define their own schemas locally with i18n.
// These are only used for backend validation in mutation hooks.

/**
 * Invite Member Request Schema
 * NOTE: Not used in forms - invite-members-card.tsx defines schema locally
 */
export const InviteMemberRequestSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "curator", "user"]).default("user"),
});

/**
 * Send Invitation Request Schema
 * NOTE: Not used in forms - validation happens in mutation hook
 */
export const SendInvitationRequestSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["owner", "admin", "curator", "user"]).default("user"),
});

/**
 * Update Member Role Request Schema
 * NOTE: Enum only - no validation messages needed
 */
export const UpdateMemberRoleRequestSchema = z.object({
  role: z.enum(["admin", "curator", "user"]),
});

/**
 * Transfer Ownership Request Schema
 * NOTE: Not used in forms - transfer-ownership-dialog.tsx defines schema locally
 */
export const TransferOwnershipRequestSchema = z.object({
  newOwnerId: z.string().uuid("ID do novo proprietário inválido"),
});

// ============================================================================
// RESPONSE SCHEMAS (constant schemas - no i18n needed)
// ============================================================================

export const MembersResponseSchema = z.object({
  users: z.array(MemberSchema),
});

export const InviteMemberResponseSchema = z.object({
  inviteCode: z.string(),
  expiresAt: z.string().datetime(),
});

export const SendInvitationResponseSchema = z.object({
  invitation: InvitationSchema,
});

export const InvitationsResponseSchema = z.object({
  invitations: z.array(InvitationSchema),
});

export const TransferOwnershipResponseSchema = z.object({
  success: z.boolean(),
  previousOwnerId: z.string().uuid(),
  newOwnerId: z.string().uuid(),
  message: z.string(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Member = z.infer<typeof MemberSchema>;
export type Invitation = z.infer<typeof InvitationSchema>;

// Request types
export type InviteMemberRequest = z.infer<typeof InviteMemberRequestSchema>;
export type SendInvitationRequest = z.infer<typeof SendInvitationRequestSchema>;
export type UpdateMemberRoleRequest = z.infer<typeof UpdateMemberRoleRequestSchema>;
export type TransferOwnershipRequest = z.infer<typeof TransferOwnershipRequestSchema>;

// Response types
export type MembersResponse = z.infer<typeof MembersResponseSchema>;
export type InviteMemberResponse = z.infer<typeof InviteMemberResponseSchema>;
export type SendInvitationResponse = z.infer<typeof SendInvitationResponseSchema>;
export type InvitationsResponse = z.infer<typeof InvitationsResponseSchema>;
export type TransferOwnershipResponse = z.infer<typeof TransferOwnershipResponseSchema>;
