import { z } from "zod";

/**
 * Schema para usuário
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Schema para usuário com informações de tenant
 * Roles: owner (full access), admin (manage team/bots), curator (edit bots), user (view only)
 */
export const TenantUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["owner", "admin", "curator", "user"]),
  emailVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type TenantUser = z.infer<typeof TenantUserSchema>;

/**
 * Schema para resposta do perfil do usuário
 */
export const UserProfileSchema = z.object({
  user: UserSchema,
});

export type UserProfileResponse = z.infer<typeof UserProfileSchema>;

/**
 * Schema para atualização de usuário
 */
export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres")
    .optional(),
});

export type UpdateUserData = z.infer<typeof UpdateUserSchema>;

/**
 * Schema para atualização de usuário do tenant
 */
export const UpdateTenantUserSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),
  email: z.string().email("Email inválido").optional(),
});

export type UpdateTenantUserData = z.infer<typeof UpdateTenantUserSchema>;

/**
 * Schema para resposta de lista de usuários do tenant
 */
export const TenantUsersResponseSchema = z.object({
  users: z.array(TenantUserSchema),
});

export type TenantUsersResponse = z.infer<typeof TenantUsersResponseSchema>;

/**
 * Schema para resposta de sucesso de deleção
 */
export const DeleteSuccessSchema = z.object({
  success: z.boolean(),
});

export type DeleteSuccessResponse = z.infer<typeof DeleteSuccessSchema>;
