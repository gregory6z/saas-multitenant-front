import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TranslatedFormMessage } from "@/components/ui/translated-form-message";
import { cn } from "@/utils/cn";
import { createResetPasswordSchema, type ResetPasswordFormData } from "@/schemas/auth";

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<"form">) {
  const { t } = useTranslation("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(createResetPasswordSchema(t)),
    defaultValues: {
      email: "",
    },
  });

  // Simulate different error scenarios for demonstration
  const simulateResetErrors = (email: string) => {
    // Simulate server error for any email containing "error"
    if (email.includes("error")) {
      return "serverError";
    }
    if (email === "notfound@test.com") {
      return "emailNotFound";
    }
    if (email === "blocked@test.com") {
      return "accountBlocked";
    }
    return null;
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate different error scenarios
      const errorType = simulateResetErrors(data.email);
      if (errorType) {
        setServerError(t(`resetPassword.errors.${errorType}`));
        return;
      }

      // Success case
      setIsSuccess(true);
      console.log("Reset password email sent:", data);
    } catch (_error) {
      setServerError(t("resetPassword.errors.serverError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary">{t("resetPassword.success.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("resetPassword.success.message")}
          </p>
        </div>

        <Button asChild variant="outline" className="w-full h-12 text-base font-medium rounded-xl">
          <Link to="/auth/login">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("resetPassword.backToLogin")}
          </Link>
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
          <h1 className="text-2xl font-bold text-primary">{t("resetPassword.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("resetPassword.subtitle")}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Server Error Display */}
          {serverError && (
            <div className="p-4 text-sm text-red-700 bg-red-50 border-l-4 border-red-400 rounded-r-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{serverError}</p>
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
                <FormLabel>{t("resetPassword.email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("resetPassword.emailPlaceholder")}
                    type="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("common:status.loading")}
              </div>
            ) : (
              t("resetPassword.submit")
            )}
          </Button>

          {/* Back to Login */}
          <Button
            asChild
            variant="ghost"
            className="w-full h-12 text-base font-medium rounded-xl"
            disabled={isLoading}
          >
            <Link to="/auth/login">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("resetPassword.backToLogin")}
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
