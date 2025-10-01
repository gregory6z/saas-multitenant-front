import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import i18n from "./i18n";
import { getAuthToken, removeAuthToken } from "@/auth/storage";

// Extend Axios config to include tenantId
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  tenantId?: string;
}

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add access token from auth storage + send cookies
api.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    // Add access token from auth storage (cookie/localStorage) to Authorization header
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add tenant context for API calls
    // In development: we'll add this via a custom header
    // In production: backend can extract from subdomain
    const isLocalhost = typeof window !== "undefined" && window.location.host.includes("localhost");
    if (isLocalhost) {
      // For development, we'll add tenant ID if available in the request config
      // This will be set by individual API calls that need tenant context
      if (config.tenantId) {
        config.headers["X-Tenant-ID"] = config.tenantId;
      }
    }

    // Include credentials to send cookies across subdomains
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Clear auth token from all storage
      removeAuthToken();

      // Redirect to main domain login
      const protocol = window.location.protocol;
      if (window.location.host.includes("localhost")) {
        window.location.href = `${protocol}//localhost:3000/auth/login`;
      } else {
        window.location.href = `${protocol}//multisaas.app/auth/login`;
      }
    }

    // Handle 500 errors (server error) - add generic message
    if (error.response?.status === 500) {
      error.message = i18n.t("common:errors.serverError");
    }

    // Handle network errors (connection refused, timeout, etc.)
    if (!error.response) {
      // Network error (ERR_CONNECTION_REFUSED, ERR_NETWORK, timeout, etc.)
      error.message = i18n.t("common:errors.networkError");
    }

    return Promise.reject(error);
  }
);

export default api;
