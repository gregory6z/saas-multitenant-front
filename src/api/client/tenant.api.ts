import type {
  CreateTenantRequest,
  CreateTenantResponse,
  JoinTenantRequest,
  JoinTenantResponse,
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
 * Create a new tenant
 * POST /tenants
 */
export async function createTenant(data: CreateTenantRequest): Promise<CreateTenantResponse> {
  const response = await api.post("/tenants", data);
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

/**
 * Join tenant via invite code
 * POST /tenants/join
 */
export async function joinTenant(data: JoinTenantRequest): Promise<JoinTenantResponse> {
  const response = await api.post("/tenants/join", data);
  return response.data;
}
