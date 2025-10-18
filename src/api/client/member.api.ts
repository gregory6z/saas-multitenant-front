import type {
  InvitationsResponse,
  MembersResponse,
  SendInvitationRequest,
  SendInvitationResponse,
  TransferOwnershipRequest,
  TransferOwnershipResponse,
  UpdateMemberRoleRequest,
} from "@/api/schemas/member.schema";
import { api } from "@/lib/axios";

/**
 * Member API Client
 * Pure HTTP calls using axios - NO Tanstack Query here
 */

/**
 * Get all members of current tenant
 * GET /users
 */
export async function getMembers(): Promise<MembersResponse> {
  const response = await api.get("/users");
  return response.data;
}

/**
 * Remove a member from the workspace
 * DELETE /tenants/users/:userId
 */
export async function removeMember(userId: string): Promise<void> {
  await api.delete(`/tenants/users/${userId}`);
}

/**
 * Update member's role
 * PATCH /tenants/users/:userId/role
 */
export async function updateMemberRole(
  userId: string,
  data: UpdateMemberRoleRequest
): Promise<void> {
  await api.patch(`/tenants/users/${userId}/role`, data);
}

/**
 * Transfer workspace ownership to another member
 * POST /tenants/transfer-ownership
 */
export async function transferOwnership(
  data: TransferOwnershipRequest
): Promise<TransferOwnershipResponse> {
  const response = await api.post("/tenants/transfer-ownership", data);
  return response.data;
}

/**
 * Get all invitations for current tenant
 * GET /invitations
 */
export async function getInvitations(): Promise<InvitationsResponse> {
  const response = await api.get("/invitations");
  return response.data;
}

/**
 * Send a new invitation
 * POST /invitations
 */
export async function sendInvitation(data: SendInvitationRequest): Promise<SendInvitationResponse> {
  const response = await api.post("/invitations", data);
  return response.data;
}

/**
 * Revoke (cancel) an invitation
 * DELETE /invitations/:invitationId
 */
export async function revokeInvitation(invitationId: string): Promise<void> {
  await api.delete(`/invitations/${invitationId}`);
}

/**
 * Resend an invitation email
 * POST /invitations/:invitationId/resend
 */
export async function resendInvitation(invitationId: string): Promise<void> {
  await api.post(`/invitations/${invitationId}/resend`);
}

/**
 * Accept an invitation (user accepting their own invite)
 * POST /invitations/:invitationId/accept
 */
export async function acceptInvitation(invitationId: string): Promise<void> {
  await api.post(`/invitations/${invitationId}/accept`);
}
