import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { AuthLayout } from "@/components/auth-layout";
import { RenewPasswordForm } from "@/routes/auth/renew-password/-renew-password-form";

export const Route = createFileRoute("/auth/renew-password/")({
  component: RenewPasswordComponent,
});

function RenewPasswordComponent() {
  const { t } = useTranslation("auth");

  return (
    <AuthLayout
      heroTitle={t("renewPassword.heroTitle")}
      heroDescription={t("renewPassword.heroDescription")}
    >
      <RenewPasswordForm />
    </AuthLayout>
  );
}
