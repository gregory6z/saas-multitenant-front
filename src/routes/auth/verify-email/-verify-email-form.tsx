import { Link, useSearch } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/utils/cn";

export function VerifyEmailForm({ className, ...props }: React.ComponentProps<"div">) {
  const { t } = useTranslation("auth");
  const { verifyEmail } = useAuth();

  // Get token from URL search params
  const search = useSearch({ from: "/auth/verify-email/" });
  const tokenFromUrl = search.token;
  const hasTriedVerify = useRef(false);

  // Auto-verify when token is present in URL (only once)
  useEffect(() => {
    if (tokenFromUrl && !hasTriedVerify.current) {
      hasTriedVerify.current = true;
      verifyEmail.mutate({ token: tokenFromUrl });
    }
  }, [tokenFromUrl, verifyEmail.mutate]);

  // Loading state
  if (verifyEmail.isPending) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-primary">{t("verifyEmail.verifying.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("verifyEmail.verifying.message")}
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (verifyEmail.isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-primary">{t("verifyEmail.success.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("verifyEmail.success.message")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link to="/auth/login">
            <Button className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-lg hover:shadow-xl">
              {t("verifyEmail.success.loginButton")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  if (verifyEmail.error) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-primary">{t("verifyEmail.error.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {verifyEmail.error?.message || t("errors.serverError")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            onClick={() => verifyEmail.mutate({ token: tokenFromUrl || "" })}
            className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {t("verifyEmail.error.retryButton")}
          </Button>

          <Link to="/auth/login">
            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
            >
              {t("verifyEmail.error.loginButton")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // No token state
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <AlertCircle className="h-6 w-6 text-orange-600" />
        </div>
        <h1 className="text-2xl font-bold text-primary">{t("verifyEmail.noToken.title")}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {t("verifyEmail.noToken.message")}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Link to="/auth/login">
          <Button className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-lg hover:shadow-xl">
            {t("verifyEmail.noToken.loginButton")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
