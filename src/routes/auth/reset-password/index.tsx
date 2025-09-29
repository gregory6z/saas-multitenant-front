import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { AuthLayout } from "@/components/auth-layout";
import { ResetPasswordForm } from "@/routes/auth/reset-password/-reset-password-form";

export const Route = createFileRoute("/auth/reset-password/")({
  component: ResetPasswordComponent,
});

function ResetPasswordComponent() {
  const { t } = useTranslation("auth");

  return (
    <AuthLayout
      heroTitle={t("resetPassword.heroTitle")}
      heroDescription={t("resetPassword.heroDescription")}
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
