import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard/_layout")({
  component: MainLayout,
});

function MainLayout() {
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated (access token not in localStorage)
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Render dashboard layout if authenticated
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
