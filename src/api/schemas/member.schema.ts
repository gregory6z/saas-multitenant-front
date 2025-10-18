import { z } from "zod";
import { TenantUserSchema } from "@/lib/schemas/users";

/**
 * Member Schema - Re-export do TenantUserSchema existente
 * Roles: owner (full access), admin (manage team/bots), curator (edit bots), user (view only)
 */
export const MemberSchema = TenantUserSchema;

/**
 * Members Response Schema - Lista de membros
 */
export const MembersResponseSchema = z.object({
  users: z.array(MemberSchema),
});

/**
 * Invite Member Request Schema - Dados para convidar membro
 */
export const InviteMemberRequestSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "curator", "user"]).default("user"),
});

/**
 * Invite Member Response Schema - Resposta após criar convite
 */
export const InviteMemberResponseSchema = z.object({
  inviteCode: z.string(),
  expiresAt: z.string().datetime(),
});

/**
 * Update Member Role Request Schema - Alterar função de membro
 */
export const UpdateMemberRoleRequestSchema = z.object({
  role: z.enum(["admin", "curator", "user"]),
});

/**
 * Transfer Ownership Request Schema - Transferir propriedade
 */
export const TransferOwnershipRequestSchema = z.object({
  newOwnerId: z.string().uuid("ID do novo proprietário inválido"),
});

/**
 * Transfer Ownership Response Schema - Resposta da transferência
 */
export const TransferOwnershipResponseSchema = z.object({
  success: z.boolean(),
  previousOwnerId: z.string().uuid(),
  newOwnerId: z.string().uuid(),
  message: z.string(),
});

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

/**
 * Invitations Response Schema - Lista de convites
 */
export const InvitationsResponseSchema = z.object({
  invitations: z.array(InvitationSchema),
});

/**
 * Send Invitation Request Schema - Dados para enviar convite
 */
export const SendInvitationRequestSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["owner", "admin", "curator", "user"]).default("user"),
});

/**
 * Send Invitation Response Schema - Resposta após enviar convite
 */
export const SendInvitationResponseSchema = z.object({
  invitation: InvitationSchema,
});

// Export types
export type Member = z.infer<typeof MemberSchema>;
export type MembersResponse = z.infer<typeof MembersResponseSchema>;
export type InviteMemberRequest = z.infer<typeof InviteMemberRequestSchema>;
export type InviteMemberResponse = z.infer<typeof InviteMemberResponseSchema>;
export type UpdateMemberRoleRequest = z.infer<typeof UpdateMemberRoleRequestSchema>;
export type TransferOwnershipRequest = z.infer<typeof TransferOwnershipRequestSchema>;
export type TransferOwnershipResponse = z.infer<typeof TransferOwnershipResponseSchema>;
export type Invitation = z.infer<typeof InvitationSchema>;
export type InvitationsResponse = z.infer<typeof InvitationsResponseSchema>;
export type SendInvitationRequest = z.infer<typeof SendInvitationRequestSchema>;
export type SendInvitationResponse = z.infer<typeof SendInvitationResponseSchema>;
