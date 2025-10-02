import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/auth/storage";
import { api } from "@/lib/axios";

export const Route = createFileRoute("/_authenticated")({
  // beforeLoad runs BEFORE component renders (best practice)
  beforeLoad: async ({ location }) => {
    // First check authentication
    if (!isAuthenticated()) {
      throw redirect({
        to: "/auth/login",
        search: {
          // Save where user wanted to go for redirect after login
          redirect: location.href,
        },
      });
    }

    // Skip tenant validation ONLY for the create tenant page itself
    if (location.pathname === "/dashboard/tenants/create") {
      console.log("[_authenticated] Skipping validation for tenant creation page");
      return;
    }

    // Check if user has at least one tenant before accessing dashboard
    console.log("[_authenticated] Starting tenant validation for:", location.pathname);

    try {
      const response = await api.get("/tenants");
      const tenants = response.data?.tenants || [];

      console.log("[_authenticated] Tenant check result:", {
        pathname: location.pathname,
        tenantsCount: tenants.length,
        tenants: tenants,
        shouldBlock: tenants.length === 0,
      });

      // Block ALL dashboard routes if user has no tenants
      if (tenants.length === 0) {
        console.log("[_authenticated] ❌ NO TENANTS - Blocking access and redirecting");
        throw redirect({
          to: "/dashboard/tenants/create",
          replace: true,
        });
      }

      console.log("[_authenticated] ✅ User has tenants - Access granted");
    } catch (error) {
      console.log("[_authenticated] Error during tenant check:", error);
      // If the error is a redirect, re-throw it
      if (error && typeof error === "object" && "isRedirect" in error) {
        console.log("[_authenticated] Re-throwing redirect");
        throw error;
      }
      // Other API errors should also block access
      console.log("[_authenticated] ❌ API Error - Blocking access");
      throw redirect({
        to: "/dashboard/tenants/create",
        replace: true,
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  // No need to check auth here - beforeLoad already did it
  return <Outlet />;
}
