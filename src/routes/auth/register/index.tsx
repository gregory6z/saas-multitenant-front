import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { AuthLayout } from "@/components/layouts/auth-layout";
import { RegisterForm } from "@/routes/auth/register/-register-form";

export const Route = createFileRoute("/auth/register/")({
  component: RegisterComponent,
});

function RegisterComponent() {
  const { t } = useTranslation("auth");

  return (
    <AuthLayout heroTitle={t("register.heroTitle")} heroDescription={t("register.heroDescription")}>
      <RegisterForm />
    </AuthLayout>
  );
}
