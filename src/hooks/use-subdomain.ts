import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "@/lib/axios";

// Schema for subdomain detection
const SubdomainResponseSchema = z.object({
  tenant: z.object({
    id: z.string(),
    name: z.string(),
    subdomain: z.string(),
    status: z.enum(["active", "inactive"]),
    ownerId: z.string(),
  }),
});

export type SubdomainTenant = z.infer<typeof SubdomainResponseSchema>["tenant"];

/**
 * Hook to detect and validate current subdomain
 * Returns tenant information based on the current subdomain
 */
export function useSubdomain() {
  // Extract subdomain from current hostname
  const getCurrentSubdomain = (): string | null => {
    if (typeof window === "undefined") return null;
    
    const hostname = window.location.hostname;
    
    // Development: handle localhost with subdomain (tenant1.localhost)
    if (hostname.includes("localhost")) {
      const parts = hostname.split(".");
      return parts.length > 1 ? parts[0] : null;
    }
    
    // Production: handle multisaas.app subdomains (tenant1.multisaas.app)
    if (hostname.includes("multisaas.app")) {
      const parts = hostname.split(".");
      return parts.length > 2 ? parts[0] : null;
    }
    
    // Default: no subdomain detected
    return null;
  };

  const subdomain = getCurrentSubdomain();

  return useQuery({
    queryKey: ["subdomain", subdomain],
    queryFn: async (): Promise<SubdomainTenant | null> => {
      if (!subdomain) {
        return null;
      }

      try {
        const response = await api.get(`/tenants/by-subdomain/${subdomain}`);
        const validatedData = SubdomainResponseSchema.parse(response.data);
        return validatedData.tenant;
      } catch (error) {
        console.error("Failed to fetch tenant by subdomain:", error);
        throw error;
      }
    },
    enabled: !!subdomain,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      // Don't retry on client errors (tenant not found, etc.)
      if (status && status >= 400 && status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

/**
 * Utility function to get current subdomain (client-side only)
 */
export const getCurrentSubdomain = (): string | null => {
  if (typeof window === "undefined") return null;
  
  const hostname = window.location.hostname;
  
  // Development
  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    return parts.length > 1 ? parts[0] : null;
  }
  
  // Production
  if (hostname.includes("multisaas.app")) {
    const parts = hostname.split(".");
    return parts.length > 2 ? parts[0] : null;
  }
  
  return null;
};

/**
 * Check if current URL has a subdomain
 */
export const hasSubdomain = (): boolean => {
  return getCurrentSubdomain() !== null;
};