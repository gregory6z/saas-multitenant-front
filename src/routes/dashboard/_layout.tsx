import { createFileRoute, Outlet } from "@tanstack/react-router";
import { api } from "@/lib/axios";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { isLocalhost, getLoginUrl } from "@/lib/url-utils";

export const Route = createFileRoute("/dashboard/_layout")({
  // No need for beforeLoad here - _authenticated.tsx already handles auth
  // This loader only handles tenant validation
  loader: async ({ location }) => {
    // Skip tenant validation for /tenants/create (user doesn't have tenant yet)
    if (location.pathname.includes('/tenants/create')) {
      return { tenant: null };
    }

    // Skip tenant validation for localhost development
    if (isLocalhost()) {
      return { tenant: null };
    }

    try {
      const response = await api.get("/me/tenant");
      return { tenant: response.data };
    } catch (error) {
      throw new Error("Failed to load organization");
    }
  },

  // Show loading state while loader runs
  pendingComponent: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground">Carregando organização...</p>
      </div>
    </div>
  ),

  // Handle loader errors
  errorComponent: ({ error }) => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-2xl font-bold text-red-600">Organização não encontrada</h1>
        <p className="text-muted-foreground">
          {error.message || "A organização solicitada não existe ou você não tem acesso a ela."}
        </p>
        <button
          type="button"
          onClick={() => {
            window.location.href = getLoginUrl();
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Voltar ao Login
        </button>
      </div>
    </div>
  ),

  component: MainLayout,
});

function MainLayout() {
  // Loader already validated auth and tenant
  // No need for conditional rendering here
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
