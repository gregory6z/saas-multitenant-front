import { MAIN_DOMAIN, PRODUCTION_DOMAIN } from "@/lib/env";

/**
 * Utilitários para construção de URLs
 */

/**
 * Retorna o protocolo baseado no ambiente
 */
export const getProtocol = (): string => {
  return import.meta.env.DEV ? "http:" : window.location.protocol;
};

/**
 * Verifica se está rodando em localhost
 */
export const isLocalhost = (): boolean => {
  return window.location.host.includes("localhost");
};

/**
 * URL de login no domínio principal
 */
export const getLoginUrl = (): string => {
  const protocol = getProtocol();
  return `${protocol}//${MAIN_DOMAIN}/auth/login`;
};

/**
 * Constrói URL de subdomain para um tenant
 */
export const getTenantSubdomainUrl = (subdomain: string, path = ""): string => {
  const protocol = getProtocol();

  if (isLocalhost()) {
    // Development: sem subdomains
    return `${protocol}//${MAIN_DOMAIN}${path}`;
  }

  // Production: com subdomain
  return `${protocol}//${subdomain}.${PRODUCTION_DOMAIN}${path}`;
};
