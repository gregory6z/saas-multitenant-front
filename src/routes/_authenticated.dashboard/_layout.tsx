import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard/header";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated/dashboard/_layout")({
  // Auth and tenant validation already handled by _authenticated.tsx
  // No loader needed here - avoid duplicate validations
  component: MainLayout,
});

function MainLayout() {
  // Loader already validated auth and tenant
  // No need for conditional rendering here
  return (
    <div className="bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-card h-[60px]">
        <DashboardHeader />
      </div>

      <div className="flex">
        <SidebarProvider>
          <AppSidebar className="fixed left-0 h-[calc(100vh-60px)] top-[60px] overflow-y-auto" />
          <main className="flex-1 ml-[--sidebar-width] w-full pt-[60px] min-h-[calc(100vh-60px)]">
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}
