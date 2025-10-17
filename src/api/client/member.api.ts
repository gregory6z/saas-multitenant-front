import type {
  MembersResponse,
  TransferOwnershipRequest,
  TransferOwnershipResponse,
  UpdateMemberRoleRequest,
} from "@/api/schemas/member.schema";
import { api } from "@/lib/axios";

/**
 * Member API Client
 * Pure HTTP calls using axios - NO Tanstack Query here
 * NOTE: Invitation endpoints are in hooks/use-invitations.ts
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
