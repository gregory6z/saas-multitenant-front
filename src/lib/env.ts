import { z } from "zod";

/**
 * Validação de variáveis de ambiente com Zod
 */

const envSchema = z.object({
  VITE_API_URL: z.string().min(1),
  VITE_APP_URL: z.string().min(1),
  VITE_MAIN_DOMAIN: z.string().min(1),
  VITE_PRODUCTION_DOMAIN: z.string().min(1),
});

const env = envSchema.parse(import.meta.env);

export const API_URL = env.VITE_API_URL;
export const APP_URL = env.VITE_APP_URL;
export const MAIN_DOMAIN = env.VITE_MAIN_DOMAIN;
export const PRODUCTION_DOMAIN = env.VITE_PRODUCTION_DOMAIN;
