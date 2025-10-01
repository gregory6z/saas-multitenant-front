import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { SubdomainRedirect } from "@/components/layout/subdomain-redirect";

export const Route = createRootRoute({
  component: () => (
    <>
      {/* Temporariamente desabilitado para testar .local */}
      {/* <SubdomainRedirect /> */}
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </>
  ),
});
