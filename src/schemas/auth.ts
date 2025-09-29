import type { useTranslation } from "react-i18next";
import { z } from "zod";

// Create schema function that accepts translation function
export const createRegisterSchema = (t: ReturnType<typeof useTranslation>["t"]) =>
  z
    .object({
      name: z
        .string()
        .min(2, { error: t("validation.name.minLength") })
        .max(50, { error: t("validation.name.maxLength") }),
      email: z.email({ error: t("validation.email.invalid") }),
      password: z
        .string()
        .min(8, { error: t("validation.password.minLengthRegister") })
        .regex(/[A-Z]/, { error: t("validation.password.complexity") })
        .regex(/[a-z]/, { error: t("validation.password.complexity") })
        .regex(/[0-9]/, { error: t("validation.password.complexity") }),
      confirmPassword: z.string().min(1, { error: t("validation.confirmPassword.required") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.confirmPassword.match"),
      path: ["confirmPassword"],
    });

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;

// Renew Password schema
export const createRenewPasswordSchema = (t: ReturnType<typeof useTranslation>["t"]) =>
  z
    .object({
      password: z
        .string()
        .min(8, { error: t("validation.password.minLengthRegister") })
        .regex(/[A-Z]/, { error: t("validation.password.complexity") })
        .regex(/[a-z]/, { error: t("validation.password.complexity") })
        .regex(/[0-9]/, { error: t("validation.password.complexity") }),
      confirmPassword: z.string().min(1, { error: t("validation.confirmPassword.required") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.confirmPassword.match"),
      path: ["confirmPassword"],
    });

export type RenewPasswordFormData = z.infer<ReturnType<typeof createRenewPasswordSchema>>;

// Reset Password schema
export const createResetPasswordSchema = (t: ReturnType<typeof useTranslation>["t"]) =>
  z.object({
    email: z.email({ error: t("validation.email.invalid") }),
  });

export type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>;

// Login schema
export const createLoginSchema = (t: ReturnType<typeof useTranslation>["t"]) =>
  z.object({
    email: z.email({ error: t("validation.email.invalid") }),
    password: z.string().min(1, { error: t("validation.password.required") }),
  });

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

// Verify Email schema
export const createVerifyEmailSchema = (t: ReturnType<typeof useTranslation>["t"]) =>
  z.object({
    token: z.string().min(1, { error: t("validation.token.required") }),
  });

export type VerifyEmailFormData = z.infer<ReturnType<typeof createVerifyEmailSchema>>;

// Legacy alias for backward compatibility (can be removed later)
export const createActivateAccountSchema = createVerifyEmailSchema;
export type ActivateAccountFormData = VerifyEmailFormData;
