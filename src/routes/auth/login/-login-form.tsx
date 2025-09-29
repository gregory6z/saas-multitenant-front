import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TranslatedFormMessage } from "@/components/ui/translated-form-message";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { createLoginSchema, type LoginFormData } from "@/schemas/auth";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { t } = useTranslation("auth");
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-primary">{t("login.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">{t("login.subtitle")}</p>
        </div>

        <div className="grid gap-6">
          {/* GitHub Login Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base font-medium rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer"
            disabled={login.isPending}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-3">
              <title>GitHub</title>
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            {t("login.githubLogin")}
          </Button>

          {/* Separator */}
          <div className="relative flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-gray-400 px-4 text-sm">{t("login.orContinue")}</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Server Error Display */}
          {login.error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 border-l-4 border-red-400 rounded-r-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{login.error?.message || t("errors.serverError")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("login.emailPlaceholder")}
                    type="email"
                    disabled={login.isPending}
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
                <FormLabel>{t("login.password")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("login.passwordPlaceholder")}
                    type="password"
                    disabled={login.isPending}
                    {...field}
                  />
                </FormControl>
                <div className="flex items-start justify-between">
                  <TranslatedFormMessage />
                  <Link
                    to="/auth/reset-password"
                    className="text-sm text-primary hover:underline underline-offset-4 ml-auto"
                    tabIndex={login.isPending ? -1 : 0}
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={login.isPending}
          >
            {login.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("common:status.loading")}
              </div>
            ) : (
              t("login.submit")
            )}
          </Button>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center text-xs text-gray-500 leading-relaxed">
          {t("login.termsMessage")}{" "}
          <a href="#link" className="underline underline-offset-4 hover:text-gray-700">
            {t("login.termsOfService")}
          </a>{" "}
          {t("login.and")}{" "}
          <a href="#link" className="underline underline-offset-4 hover:text-gray-700">
            {t("login.privacyPolicy")}
          </a>
          .
        </div>

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          {t("login.noAccount")}{" "}
          <Link to="/auth/register" className="underline underline-offset-4">
            {t("login.signUp")}
          </Link>
        </div>
      </form>
    </Form>
  );
}
