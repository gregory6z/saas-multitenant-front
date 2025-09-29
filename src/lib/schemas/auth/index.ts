import { z } from "zod";

/**
 * Schema para criação de conta
 */
export const CreateAccountSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.string().email("Email inválido").max(255, "Email deve ter no máximo 255 caracteres"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
  tenantId: z.string().uuid().optional(),
});

export type CreateAccountData = z.infer<typeof CreateAccountSchema>;

/**
 * Schema para autenticação/login
 */
export const AuthenticateSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type AuthenticateData = z.infer<typeof AuthenticateSchema>;

/**
 * Schema para resposta de autenticação
 */
export const AuthResponseSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

/**
 * Schema para recuperação de senha
 */
export const RequestPasswordRecoverySchema = z.object({
  email: z.string().email("Email inválido"),
});

export type RequestPasswordRecoveryData = z.infer<typeof RequestPasswordRecoverySchema>;

/**
 * Schema para reset de senha
 */
export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  newPassword: z
    .string()
    .min(6, "Nova senha deve ter pelo menos 6 caracteres")
    .max(100, "Nova senha deve ter no máximo 100 caracteres"),
});

export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;

/**
 * Schema para verificação de email
 */
export const EmailVerificationSchema = z.object({
  success: z.boolean(),
});

export type EmailVerificationResponse = z.infer<typeof EmailVerificationSchema>;
