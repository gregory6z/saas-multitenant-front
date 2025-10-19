import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated/dashboard/_layout")({
  // Auth and tenant validation already handled by _authenticated.tsx
  // No loader needed here - avoid duplicate validations
  component: MainLayout,
});

function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-sidebar">
        <div className="h-screen py-1 px-2">
          <div className="rounded-3xl bg-card border border-blue-200 h-full flex flex-col overflow-hidden">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
