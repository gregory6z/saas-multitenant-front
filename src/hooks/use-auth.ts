import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated as checkIsAuthenticated } from "@/lib/auth-storage";
import type { LoginFormData, RegisterFormData, VerifyEmailFormData } from "@/schemas/auth";

interface AuthResponse {
  token: string;
}

interface VerifyEmailResponse {
  success: boolean;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t: tAuth } = useTranslation("auth");

  const getToken = getAuthToken;
  const isAuthenticated = checkIsAuthenticated();

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData): Promise<void> => {
      const response = await api.post("/accounts", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success(tAuth("register.success.title"));
    },
    onError: (error: Error & { response?: { status: number } }) => {
      // Handle 409 error (email already exists)
      if (error.response?.status === 409) {
        error.message = tAuth("errors.emailAlreadyExists");
      }
    },
    // Register optimizations
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      // Don't retry on client errors (400-499)
      if (status && status >= 400 && status < 500) {
        return false;
      }
      // Retry up to 2 times on server errors or network issues
      return failureCount < 2;
    },
    networkMode: "always", // Always try to execute, even offline
    mutationKey: ["auth", "register"],
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData): Promise<AuthResponse> => {
      const response = await api.post("/sessions", data);
      return response.data;
    },
    onSuccess: async (data) => {
      setAuthToken(data.token);
      toast.success(tAuth("login.success.title"));

      // Wait a bit for cookie to be set before redirecting
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if user has tenants before redirecting
      try {
        const tenantsResponse = await api.get("/tenants");
        const tenants = tenantsResponse.data.tenants || [];

        if (tenants.length === 0) {
          // No tenants, redirect to tenant creation
          navigate({ to: "/tenants/create" });
        } else {
          // Has tenants
          const currentHost = window.location.host;
          
          if (currentHost.includes("localhost")) {
            // Development: Don't use subdomains, just go to dashboard
            console.log("Development mode: redirecting to dashboard");
            navigate({ to: "/dashboard/chatbots" });
          } else {
            // Production: redirect to first tenant's subdomain
            const firstTenant = tenants[0];
            const protocol = window.location.protocol;
            const subdomainUrl = `${protocol}//${firstTenant.subdomain}.multisaas.app/dashboard/chatbots`;
            
            console.log("Production mode: redirecting to:", subdomainUrl);
            console.log("Token before redirect:", getAuthToken());
            
            // Redirect to subdomain
            window.location.href = subdomainUrl;
          }
        }
      } catch (error) {
        console.warn("Erro ao verificar tenants:", error);
        // If tenant check fails, redirect to tenant creation as fallback
        navigate({ to: "/tenants/create" });
      }
    },
    onError: (error: Error & { response?: { status: number } }) => {
      // Handle 400 errors (invalid credentials)
      if (error.response?.status === 400) {
        error.message = tAuth("errors.invalidCredentials");
      }
    },
    // Auth optimizations
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      // Don't retry on auth errors (400, 401, 403)
      if (status === 400 || status === 401 || status === 403) {
        return false;
      }
      // Retry up to 2 times only on network errors (5xx, timeout)
      return failureCount < 2;
    },
    networkMode: "always", // Always try to execute, even offline
    mutationKey: ["auth", "login"],
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async (data: VerifyEmailFormData): Promise<VerifyEmailResponse> => {
      const response = await api.get(`/verify-email/${data.token}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success(tAuth("verifyEmail.success.title"));
      // Show success message for a moment before redirecting
      setTimeout(() => {
        navigate({ to: "/auth/login" });
      }, 2000); // Wait 2 seconds to show success message
    },
    onError: (error: Error & { response?: { status: number } }) => {
      // Handle verification errors based on API responses
      const status = error.response?.status;
      if (status === 400) {
        error.message = tAuth("errors.invalidToken");
      } else if (status === 409) {
        error.message = tAuth("errors.emailAlreadyVerified");
      } else if (status === 404) {
        error.message = tAuth("errors.userNotFound");
      } else if (!error.response) {
        // Network errors (connection refused, timeout, etc.)
        error.message = tAuth("errors.networkError");
      }
    },
    // Verify email optimizations
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      // Don't retry on client errors (400, 404, 409)
      if (status === 400 || status === 404 || status === 409) {
        return false;
      }
      // Retry up to 1 time only on server errors
      return failureCount < 1;
    },
    networkMode: "always",
    mutationKey: ["auth", "verify-email"],
  });

  const logoutMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.warn("Server logout failed:", error);
      }
    },
    onSuccess: () => {
      removeAuthToken();
      queryClient.clear();
      
      // Redirect to main domain login
      const protocol = window.location.protocol;
      if (window.location.host.includes("localhost")) {
        window.location.href = `${protocol}//localhost:3000/auth/login`;
      } else {
        window.location.href = `${protocol}//multisaas.app/auth/login`;
      }
    },
    onError: () => {
      removeAuthToken();
      queryClient.clear();
      
      // Redirect to main domain login even on error
      const protocol = window.location.protocol;
      if (window.location.host.includes("localhost")) {
        window.location.href = `${protocol}//localhost:3000/auth/login`;
      } else {
        window.location.href = `${protocol}//multisaas.app/auth/login`;
      }
    },
    // Logout optimizations
    retry: false, // Never retry logout
    networkMode: "always", // Always try to execute, even offline
    mutationKey: ["auth", "logout"],
  });

  return {
    isAuthenticated,
    register: registerMutation,
    login: loginMutation,
    logout: logoutMutation,
    verifyEmail: verifyEmailMutation,
  };
}
