import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/axios";
import {
  setAuthToken,
  removeAuthToken,
  isAuthenticated as checkIsAuthenticated,
} from "@/lib/auth-storage";
import { isLocalhost, getTenantSubdomainUrl, getLoginUrl } from "@/lib/url-utils";
import type { LoginFormData, RegisterFormData, VerifyEmailFormData } from "@/schemas/auth";

interface AuthResponse {
  token: string;
}

interface VerifyEmailResponse {
  success: boolean;
}

/**
 * Hook de autenticação otimizado com TanStack Query v5 best practices
 *
 * Otimizações aplicadas:
 * - networkMode correto (online para auth)
 * - Retry strategy específica para cada tipo de auth
 * - Cache management seletivo (não limpa tudo no logout)
 * - Error handling granular por status code (sem toasts - responsabilidade do componente)
 * - Prefetch de tenants no login para UX melhor
 * - Separation of concerns: hook gerencia state, componente gerencia UI feedback
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t: tAuth } = useTranslation("auth");

  const isAuthenticated = checkIsAuthenticated();

  /**
   * Mutation para registro de usuário
   */
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData): Promise<void> => {
      const response = await api.post("/accounts", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      return response.data;
    },

    onError: (error: Error & { response?: { status: number } }) => {
      // Error handling granular por status code
      const status = error.response?.status;

      if (status === 409) {
        // Email já existe
        error.message = tAuth("errors.emailAlreadyExists");
      } else if (status === 400) {
        // Dados inválidos
        error.message = tAuth("errors.invalidData");
      } else if (!error.response) {
        // Network error
        error.message = tAuth("errors.networkError");
      } else {
        // Erro genérico
        error.message = tAuth("errors.serverError");
      }
    },

    // Retry strategy para registro:
    // - NUNCA retry em 4xx (validation errors, email duplicado, etc)
    // - Retry 1x em 5xx (server temporariamente indisponível)
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        return false;
      }
      return failureCount < 1;
    },

    // networkMode: "online" - Auth DEVE ter conexão
    // Diferente de "always" que tentaria fazer request offline
    networkMode: "online",

    mutationKey: ["auth", "register"],
  });

  /**
   * Mutation para login com prefetch inteligente de tenants
   */
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData): Promise<AuthResponse> => {
      const response = await api.post("/sessions", data);
      return response.data;
    },

    onSuccess: async (data) => {
      // 1. Salva token IMEDIATAMENTE
      setAuthToken(data.token);

      // 2. Prefetch de tenants para decidir redirecionamento
      // Aguarda um pouco para o token ser setado nos headers
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        // Prefetch usando ensureQueryData para aproveitar cache se existir
        const tenants = await queryClient.ensureQueryData({
          queryKey: ["tenants"],
          queryFn: async () => {
            const response = await api.get("/tenants");
            return response.data.tenants || [];
          },
          // Se já tiver dados em cache, usa eles
          // Caso contrário, faz fetch
          staleTime: 5 * 60 * 1000, // 5min
        });

        // 4. Redirecionamento baseado em tenants
        if (tenants.length === 0) {
          // Sem tenants → criação de tenant
          navigate({ to: "/tenants/create" });
        } else {
          // Com tenants → dashboard
          if (isLocalhost()) {
            // Development: sem subdomains, apenas navega
            navigate({ to: "/dashboard/chatbots" });
          } else {
            // Production: redireciona para subdomain do primeiro tenant
            const firstTenant = tenants[0];
            const subdomainUrl = getTenantSubdomainUrl(
              firstTenant.subdomain,
              "/dashboard/chatbots"
            );

            window.location.href = subdomainUrl;
          }
        }
      } catch (error) {
        console.warn("Erro ao verificar tenants após login:", error);
        // Fallback: redireciona para criação de tenant
        navigate({ to: "/tenants/create" });
      }
    },

    onError: (error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;

      if (status === 400 || status === 401) {
        // Credenciais inválidas
        error.message = tAuth("errors.invalidCredentials");
      } else if (status === 403) {
        // Acesso negado (conta bloqueada, etc)
        error.message = tAuth("errors.accessDenied");
      } else if (status === 429) {
        // Rate limit
        error.message = tAuth("errors.tooManyAttempts");
      } else if (!error.response) {
        // Network error
        error.message = tAuth("errors.networkError");
      } else {
        // Erro genérico
        error.message = tAuth("errors.serverError");
      }
    },

    // Retry strategy para login:
    // - NUNCA retry em auth errors (400, 401, 403, 429)
    // - Retry 1x em 5xx apenas
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;

      // Não retry em client errors
      if (status === 400 || status === 401 || status === 403 || status === 429) {
        return false;
      }

      // Retry 1x em server errors
      return failureCount < 1;
    },

    networkMode: "online",
    mutationKey: ["auth", "login"],
  });

  /**
   * Mutation para verificação de email
   */
  const verifyEmailMutation = useMutation({
    mutationFn: async (data: VerifyEmailFormData): Promise<VerifyEmailResponse> => {
      const response = await api.get(`/verify-email/${data.token}`);
      return response.data;
    },

    onSuccess: () => {
      // Navegação imediata - componente decide se aguarda ou não
      navigate({ to: "/auth/login" });
    },

    onError: (error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;

      if (status === 400) {
        // Token inválido
        error.message = tAuth("errors.invalidToken");
      } else if (status === 409) {
        // Email já verificado
        error.message = tAuth("errors.emailAlreadyVerified");
      } else if (status === 404) {
        // Usuário não encontrado
        error.message = tAuth("errors.userNotFound");
      } else if (!error.response) {
        // Network error
        error.message = tAuth("errors.networkError");
      } else {
        error.message = tAuth("errors.serverError");
      }
    },

    // Retry strategy para verificação:
    // - NUNCA retry em 4xx (token já consumido, inválido, etc)
    // - Retry 1x em 5xx
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;

      if (status === 400 || status === 404 || status === 409) {
        return false;
      }

      return failureCount < 1;
    },

    networkMode: "online",
    mutationKey: ["auth", "verify-email"],
  });

  /**
   * Mutation para logout
   *
   * Otimização: Limpa apenas dados relacionados a auth/user, não TUDO
   */
  const logoutMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      try {
        await api.post("/auth/logout");
      } catch (error) {
        // Logout no servidor falhou, mas continuamos com logout local
        console.warn("Server logout failed:", error);
      }
    },

    onSuccess: () => {
      handleLogout();
    },

    onError: () => {
      // Mesmo em erro, faz logout local
      handleLogout();
    },

    // Logout NUNCA deve fazer retry
    retry: false,

    // Logout pode funcionar offline (apenas local)
    networkMode: "always",

    mutationKey: ["auth", "logout"],
  });

  /**
   * Helper para centralizar lógica de logout
   */
  const handleLogout = () => {
    // 1. Remove token de autenticação
    removeAuthToken();

    // 2. Limpa APENAS caches relacionados a dados autenticados
    // NÃO usar queryClient.clear() - muito agressivo!
    queryClient.removeQueries({ queryKey: ["tenants"] });
    queryClient.removeQueries({ queryKey: ["tenant"] });
    queryClient.removeQueries({ queryKey: ["chatbots"] });
    queryClient.removeQueries({ queryKey: ["user"] });
    queryClient.removeQueries({ queryKey: ["profile"] });

    // 3. Redireciona para login na main domain usando helper
    window.location.href = getLoginUrl();
  };

  return {
    // Estado de autenticação
    isAuthenticated,

    // Mutations
    register: registerMutation,
    login: loginMutation,
    logout: logoutMutation,
    verifyEmail: verifyEmailMutation,
  };
}
