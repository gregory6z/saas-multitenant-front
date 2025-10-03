import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { getAuthToken, removeAuthToken, setAuthToken } from "@/auth/storage";
import { getLoginUrl } from "@/lib/url-utils";
import i18n from "./i18n";

// Extend Axios config to include tenantId, retry count, and refresh tracking
export interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  tenantId?: string;
  retry?: number;
  _isRetryAfterRefresh?: boolean; // Flag to prevent infinite refresh loops
}

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => status >= 200 && status < 300,
});

// Request interceptor - add access token from auth storage + send cookies
api.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    // Add access token from auth storage (cookie/localStorage) to Authorization header
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Tenant context strategy:
    // Backend extrai tenant do Origin header (enviado automaticamente pelo navegador)
    // Navegador envia: Origin: http://<subdomain>.lvh.me:3000
    // Backend extrai subdomain para identificar o tenant

    // NOTA: Origin header é enviado automaticamente pelo navegador em requisições cross-origin
    // Não precisamos adicionar manualmente - navegador já faz isso!

    // Include credentials to send cookies across subdomains
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors with retry logic
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config as ExtendedAxiosRequestConfig;

    // Handle 401 errors (unauthorized) - try refresh token first
    if (error.response?.status === 401) {
      // Previne loop infinito: se já tentou refresh e ainda deu 401, desloga
      if (config._isRetryAfterRefresh) {
        removeAuthToken();
        if (!window.location.pathname.includes("/auth/")) {
          window.location.href = getLoginUrl();
        }
        return Promise.reject(error);
      }

      // Tenta fazer refresh do token
      try {
        // Chama endpoint de refresh (cookie httpOnly vai automaticamente)
        const { data } = await axios.patch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3333"}/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Salva o novo access token
        setAuthToken(data.token);

        // Marca que esta requisição já passou pelo refresh
        config._isRetryAfterRefresh = true;

        // Atualiza o header com o novo token
        config.headers.Authorization = `Bearer ${data.token}`;

        // Retenta a requisição original
        return api(config);
      } catch (refreshError) {
        // Refresh falhou, desloga o usuário
        removeAuthToken();
        if (!window.location.pathname.includes("/auth/")) {
          window.location.href = getLoginUrl();
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 500 errors (server error) - add generic message
    if (error.response?.status === 500) {
      error.message = i18n.t("common:errors.serverError");
    }

    // Handle network errors (connection refused, timeout, etc.) with retry logic
    if (!error.response) {
      // Network error (ERR_CONNECTION_REFUSED, ERR_NETWORK, timeout, etc.)
      error.message = i18n.t("common:errors.networkError");

      // Retry logic for network errors
      if (config) {
        // Initialize retry counter
        if (!config.retry) {
          config.retry = 0;
        }

        // Max 3 retries
        if (config.retry < 3) {
          config.retry += 1;

          // Exponential backoff: 2^retry * 1000ms (1s, 2s, 4s)
          const delay = 2 ** config.retry * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));

          // Retry the request
          return api(config);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
