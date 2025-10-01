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
 * Verifica se está em ambiente de desenvolvimento
 * Detecta localhost e lvh.me (domínio mágico para dev)
 */
export const isLocalhost = (): boolean => {
  const host = window.location.host;
  return host.includes("localhost") || host.includes("lvh.me");
};

/**
 * Extrai o subdomain da URL atual
 *
 * Exemplos:
 * - gregory-test.lvh.me:3000 → "gregory-test"
 * - tenant1.lvh.me:3000 → "tenant1"
 * - acme.multisaas.app → "acme"
 * - lvh.me:3000 → null (sem subdomain)
 * - localhost:3000 → null (sem subdomain)
 * - multisaas.app → null (sem subdomain)
 */
export const getCurrentSubdomain = (): string | null => {
  const hostname = window.location.hostname;

  // Development: tenant.lvh.me
  const mainDomainHost = MAIN_DOMAIN.split(':')[0]; // lvh.me
  if (hostname.includes(`.${mainDomainHost}`)) {
    return hostname.split(`.${mainDomainHost}`)[0];
  }

  // Legacy localhost: tenant.localhost
  if (hostname.includes('.localhost')) {
    return hostname.split('.localhost')[0];
  }

  // Production: tenant.multisaas.app
  if (hostname.includes(`.${PRODUCTION_DOMAIN}`)) {
    return hostname.split(`.${PRODUCTION_DOMAIN}`)[0];
  }

  // Sem subdomain
  return null;
};

/**
 * URL de login no domínio principal (sem subdomain)
 */
export const getLoginUrl = (): string => {
  const protocol = getProtocol();

  if (isLocalhost()) {
    // Development: usa MAIN_DOMAIN que já contém porta (localhost:3000)
    return `${protocol}//${MAIN_DOMAIN}/auth/login`;
  }

  // Production: multisaas.app/auth/login
  return `${protocol}//${PRODUCTION_DOMAIN}/auth/login`;
};

/**
 * Constrói URL de subdomain para um tenant
 *
 * Exemplos:
 * - Development: tenant1 → http://tenant1.lvh.me:3000/path
 * - Production: tenant1 → https://tenant1.multisaas.app/path
 */
export const getTenantSubdomainUrl = (subdomain: string, path = ""): string => {
  const protocol = getProtocol();

  if (isLocalhost()) {
    // Development: MAIN_DOMAIN já contém porta (lvh.me:3000)
    // Extrai base domain e adiciona subdomain
    const [baseDomain, port] = MAIN_DOMAIN.split(':');
    const domainWithSubdomain = `${subdomain}.${baseDomain}`;
    const portSuffix = port ? `:${port}` : '';
    return `${protocol}//${domainWithSubdomain}${portSuffix}${path}`;
  }

  // Production: subdomain.multisaas.app
  return `${protocol}//${subdomain}.${PRODUCTION_DOMAIN}${path}`;
};
