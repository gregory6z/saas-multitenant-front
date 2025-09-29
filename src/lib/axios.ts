import axios from "axios";
import i18n from "./i18n";

// Router reference for navigation from interceptors
let routerNavigate: ((options: { to: string }) => void) | null = null;

export const setRouterNavigate = (navigate: (options: { to: string }) => void) => {
  routerNavigate = navigate;
};

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add access token from localStorage + send httpOnly cookies
api.interceptors.request.use(
  (config) => {
    // Add access token from localStorage to Authorization header
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Include credentials to send httpOnly cookies (refresh token 'ragboost:token')
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
      // Clear access token from localStorage
      localStorage.removeItem("token");
      // Refresh token httpOnly cookie 'ragboost:token' será limpo pelo servidor

      if (routerNavigate) {
        routerNavigate({ to: "/auth/login" });
      } else {
        // Fallback to window.location only if router is not available
        window.location.href = "/auth/login";
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
