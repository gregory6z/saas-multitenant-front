/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { createRenewPasswordSchema, type RenewPasswordFormData } from "@/schemas/auth";

// Custom FormMessage component that translates validation messages
function TranslatedFormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { t } = useTranslation("auth");
  const { error, formMessageId } = useFormField();

  if (!error) {
    return null;
  }

  const message = error.message;
  const translatedMessage = message?.startsWith("validation.") ? t(message) : message;

  return (
    <p id={formMessageId} className={cn("text-destructive text-sm", className)} {...props}>
      {translatedMessage}
    </p>
  );
}

export function RenewPasswordForm({ className, ...props }: React.ComponentProps<"form">) {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RenewPasswordFormData>({
    resolver: zodResolver(createRenewPasswordSchema(t)),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Simulate different error scenarios for demonstration
  const simulateRenewErrors = (password: string) => {
    // Simulate server error for weak passwords
    if (password === "weak123") {
      return "passwordTooWeak";
    }
    if (password === "expired123") {
      return "tokenExpired";
    }
    if (password === "invalid123") {
      return "tokenInvalid";
    }
    return null;
  };

  const onSubmit = async (data: RenewPasswordFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate different error scenarios
      const errorType = simulateRenewErrors(data.password);
      if (errorType) {
        setServerError(t(`renewPassword.errors.${errorType}`));
        return;
      }

      // Success case
      setIsSuccess(true);
      console.log("Password renewed successfully:", data);

      // Redirect to login after success
      setTimeout(() => {
        navigate({ to: "/auth/login" });
      }, 3000);
    } catch (_error) {
      setServerError(t("renewPassword.errors.serverError"));
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
          <h1 className="text-2xl font-bold text-primary">{t("renewPassword.success.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("renewPassword.success.message")}
          </p>
          <p className="text-xs text-muted-foreground">{t("renewPassword.success.redirect")}</p>
        </div>
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
          <h1 className="text-2xl font-bold text-primary">{t("renewPassword.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("renewPassword.subtitle")}
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

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("renewPassword.password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={t("renewPassword.passwordPlaceholder")}
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
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
                <FormLabel>{t("renewPassword.confirmPassword")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={t("renewPassword.confirmPasswordPlaceholder")}
                      type={showConfirmPassword ? "text" : "password"}
                      disabled={isLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
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
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("common:status.loading")}
              </div>
            ) : (
              t("renewPassword.submit")
            )}
          </Button>
        </div>

        {/* Password Requirements */}
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">{t("renewPassword.requirements.title")}</p>
          <ul className="space-y-1 list-disc list-inside ml-2">
            <li>{t("renewPassword.requirements.minLength")}</li>
            <li>{t("renewPassword.requirements.uppercase")}</li>
            <li>{t("renewPassword.requirements.lowercase")}</li>
            <li>{t("renewPassword.requirements.number")}</li>
          </ul>
        </div>
      </form>
    </Form>
  );
}
