import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/auth/storage";

export const Route = createFileRoute("/_authenticated")({
  // beforeLoad runs BEFORE component renders (best practice)
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/auth/login",
        search: {
          // Save where user wanted to go for redirect after login
          redirect: location.href,
        },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  // No need to check auth here - beforeLoad already did it
  return <Outlet />;
}
