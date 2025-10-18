import type {
  TenantsResponse,
  UpdateTenantRequest,
  UpdateTenantResponse,
} from "@/api/schemas/tenant.schema";
import { api } from "@/lib/axios";

/**
 * Tenant API Client
 * Pure HTTP calls using axios - NO Tanstack Query here
 */

/**
 * Get all tenants for current user
 * GET /tenants
 */
export async function getTenants(): Promise<TenantsResponse> {
  const response = await api.get("/tenants");
  return response.data;
}

/**
 * Update tenant details
 * PUT /tenants
 * Backend extracts tenant from Origin header (subdomain)
 */
export async function updateTenant(data: UpdateTenantRequest): Promise<UpdateTenantResponse> {
  const response = await api.put("/tenants", data);
  return response.data;
}

/**
 * Delete tenant
 * DELETE /tenants
 * Backend extracts tenant from Origin header (subdomain)
 * Only OWNER can delete (CASCADE deletes all related data)
 */
export async function deleteTenant(): Promise<void> {
  await api.delete("/tenants");
}
