import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TranslatedFormMessage } from "@/components/ui/translated-form-message";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/utils/cn";
import { createRegisterSchema, type RegisterFormData } from "@/schemas/auth";

export function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {
  const { t } = useTranslation("auth");
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerSchema = createRegisterSchema(t);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    register.mutate(data);
  };

  if (register.isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Success Checkmark</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary">{t("register.success.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("register.success.message")}
          </p>
        </div>

        <Button asChild className="w-full h-12 text-base font-medium rounded-xl">
          <Link to="/auth/login">{t("register.success.goToLogin")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-primary">{t("register.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">{t("register.subtitle")}</p>
        </div>

        <div className="grid gap-6">
          {/* GitHub Register Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base font-medium rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer"
            disabled={register.isPending}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-3">
              <title>GitHub Logo</title>
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            {t("register.githubRegister")}
          </Button>

          {/* Separator */}
          <div className="relative flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-gray-400 px-4 text-sm">{t("register.orContinue")}</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Server Error Display */}
          {register.error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 border-l-4 border-red-400 rounded-r-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{register.error.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("register.namePlaceholder")}
                    type="text"
                    disabled={register.isPending}
                    {...field}
                  />
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("register.emailPlaceholder")}
                    type="email"
                    disabled={register.isPending}
                    {...field}
                  />
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={t("register.passwordPlaceholder")}
                      type={showPassword ? "text" : "password"}
                      disabled={register.isPending}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={register.isPending}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.confirmPassword")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={t("register.confirmPasswordPlaceholder")}
                      type={showConfirmPassword ? "text" : "password"}
                      disabled={register.isPending}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={register.isPending}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={register.isPending}
          >
            {register.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("common:status.loading")}
              </div>
            ) : (
              t("register.submit")
            )}
          </Button>
        </div>

        {/* Password Requirements */}
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">{t("register.requirements.title")}</p>
          <ul className="space-y-1 list-disc list-inside ml-2">
            <li>{t("register.requirements.minLength")}</li>
            <li>{t("register.requirements.uppercase")}</li>
            <li>{t("register.requirements.lowercase")}</li>
            <li>{t("register.requirements.number")}</li>
          </ul>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center text-xs text-gray-500 leading-relaxed">
          {t("register.termsMessage")}{" "}
          <a href="/terms" className="underline underline-offset-4 hover:text-gray-700">
            {t("register.termsOfService")}
          </a>{" "}
          {t("register.and")}{" "}
          <a href="/privacy" className="underline underline-offset-4 hover:text-gray-700">
            {t("register.privacyPolicy")}
          </a>
          .
        </div>

        {/* Sign In Link */}
        <div className="text-center text-sm">
          {t("register.hasAccount")}{" "}
          <Link to="/auth/login" className="underline underline-offset-4">
            {t("register.signIn")}
          </Link>
        </div>
      </form>
    </Form>
  );
}
