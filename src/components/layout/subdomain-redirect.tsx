import { useEffect, useRef } from "react";
import { useTenants } from "@/hooks/use-tenants";

/**
 * Componente que redireciona automaticamente para o subdomain do tenant
 * quando usuário acessa localhost sem subdomain
 *
 * ESTRATÉGIA:
 * - Detecta subdomain da URL atual (não usa currentTenant do contexto)
 * - Se está em localhost sem subdomain e tem tenants, redireciona para primeiro tenant
 *
 * EXCEÇÕES (não redireciona):
 * - Rotas de autenticação (/auth/*) APENAS se usuário NÃO está autenticado
 * - Criação de tenant (/dashboard/tenants/create)
 */
export function SubdomainRedirect() {
  const { tenants } = useTenants();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Previne múltiplos redirects
    if (hasRedirected.current) return;

    // Só executa se tiver tenants
    if (!tenants || tenants.length === 0) return;

    const pathname = window.location.pathname;
    const hostname = window.location.hostname;
    const isPlainLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

    // Só redireciona se estiver em localhost SEM subdomain
    if (!isPlainLocalhost) return;

    const isAuthRoute = pathname.startsWith("/auth/");
    const isTenantCreation = pathname.includes("/tenants/create");

    // NUNCA redireciona de rotas de auth ou criação de tenant
    // O login mutation é responsável por redirecionar após login bem-sucedido
    if (isAuthRoute || isTenantCreation) return;

    // Redireciona para o subdomain do primeiro tenant
    hasRedirected.current = true;
    const firstTenant = tenants[0];
    const currentPath = window.location.pathname + window.location.search + window.location.hash;

    // Constrói URL com subdomain
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : "";
    const subdomainUrl = `${protocol}//${firstTenant.subdomain}.localhost${port}${currentPath}`;

    // Evita redirect loop - só redireciona se URL for diferente
    if (window.location.href !== subdomainUrl) {
      window.location.href = subdomainUrl;
    }
  }, [tenants]);

  // Componente não renderiza nada
  return null;
}
