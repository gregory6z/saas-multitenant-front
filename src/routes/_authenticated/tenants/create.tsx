import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard/header";
import { CreateTenantForm } from "@/components/forms/create-tenant-form";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/tenants/create")({
  component: CreateTenantPage,
});

function CreateTenantPage() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 pt-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Criar Organização</h1>
            <p className="text-muted-foreground">
              Crie sua organização para começar a usar a plataforma
            </p>
          </div>

          {/* Form */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <CreateTenantForm />
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            Precisa sair?{" "}
            <button
              onClick={handleLogout}
              className="text-primary hover:underline bg-transparent border-none cursor-pointer"
              type="button"
            >
              Fazer logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
