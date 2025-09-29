import { createFileRoute } from "@tanstack/react-router";

import { AuthLayout } from "@/components/auth-layout";
import { LoginForm } from "@/routes/auth/login/-login-form";

export const Route = createFileRoute("/auth/login/")({
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
