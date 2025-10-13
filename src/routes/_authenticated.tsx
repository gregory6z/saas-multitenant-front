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
      return;
    }

    // Check if user has at least one tenant before accessing dashboard
    try {
      const response = await api.get("/tenants");
      const tenants = response.data?.tenants || [];

      // Block ALL dashboard routes if user has no tenants
      if (tenants.length === 0) {
        throw redirect({
          to: "/dashboard/tenants/create",
          replace: true,
        });
      }
    } catch (error) {
      // If the error is a redirect, re-throw it
      if (error && typeof error === "object" && "isRedirect" in error) {
        throw error;
      }
      // Other API errors should also block access
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
