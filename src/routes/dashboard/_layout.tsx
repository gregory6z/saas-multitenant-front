import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

import { AppSidebar } from "@/components/navigation/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useSubdomain } from "@/hooks/use-subdomain";

export const Route = createFileRoute("/dashboard/_layout")({
  component: MainLayout,
});

function MainLayout() {
  const { isAuthenticated } = useAuth();
  const { data: tenant, isLoading: tenantLoading, error: tenantError } = useSubdomain();

  // Redirect to login if not authenticated (access token not in localStorage)
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Skip tenant validation for localhost development
  const isLocalhost = typeof window !== "undefined" && window.location.host.includes("localhost");
  
  if (!isLocalhost) {
    // Show loading while validating tenant (production only)
    if (tenantLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando organização...</p>
          </div>
        </div>
      );
    }

    // Handle tenant validation errors (production only)
    if (tenantError || !tenant) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4 max-w-md">
            <h1 className="text-2xl font-bold text-red-600">Organização não encontrada</h1>
            <p className="text-muted-foreground">
              A organização solicitada não existe ou você não tem acesso a ela.
            </p>
            <button
              type="button"
              onClick={() => {
                // Redirect to main domain for tenant selection
                const protocol = window.location.protocol;
                window.location.href = `${protocol}//multisaas.app/auth/login`;
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      );
    }
  }

  // Render dashboard layout if authenticated and tenant is valid
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50 bg-card h-[60px]">
        <DashboardHeader />
      </div>

      <div className="flex flex-1 pt-[60px] h-full overflow-hidden">
        <SidebarProvider>
          <AppSidebar className="fixed left-0 h-[calc(100vh-60px)] top-[60px]" />
          <main className="flex-1 overflow-y-auto ml-[--sidebar-width]">
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}
