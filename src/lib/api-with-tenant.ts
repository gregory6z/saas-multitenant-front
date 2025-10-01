import { api } from "./axios";

/**
 * Get current subdomain from window location
 */
function getCurrentSubdomain(): string | null {
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
  
  return null;
}

/**
 * Enhanced API client that automatically includes tenant context
 */
export const apiWithTenant = {
  get: (url: string, config: Record<string, any> = {}) => {
    const subdomain = getCurrentSubdomain();

    return api.get(url, {
      ...config,
      headers: {
        ...config.headers,
        ...(subdomain && { "X-Tenant-Subdomain": subdomain }),
      },
    });
  },

  post: (url: string, data?: any, config: Record<string, any> = {}) => {
    const subdomain = getCurrentSubdomain();

    return api.post(url, data, {
      ...config,
      headers: {
        ...config.headers,
        ...(subdomain && { "X-Tenant-Subdomain": subdomain }),
      },
    });
  },

  put: (url: string, data?: any, config: Record<string, any> = {}) => {
    const subdomain = getCurrentSubdomain();

    return api.put(url, data, {
      ...config,
      headers: {
        ...config.headers,
        ...(subdomain && { "X-Tenant-Subdomain": subdomain }),
      },
    });
  },

  delete: (url: string, config: Record<string, any> = {}) => {
    const subdomain = getCurrentSubdomain();

    return api.delete(url, {
      ...config,
      headers: {
        ...config.headers,
        ...(subdomain && { "X-Tenant-Subdomain": subdomain }),
      },
    });
  },

  patch: (url: string, data?: any, config: Record<string, any> = {}) => {
    const subdomain = getCurrentSubdomain();

    return api.patch(url, data, {
      ...config,
      headers: {
        ...config.headers,
        ...(subdomain && { "X-Tenant-Subdomain": subdomain }),
      },
    });
  },
};

/**
 * Get tenant context for API calls
 */
export function getTenantContext() {
  const subdomain = getCurrentSubdomain();
  const isLocalhost = typeof window !== "undefined" && window.location.host.includes("localhost");
  
  return {
    subdomain,
    isLocalhost,
    headers: {
      ...(subdomain && { "X-Tenant-Subdomain": subdomain }),
    },
  };
}