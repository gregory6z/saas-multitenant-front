import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/chatbots/$id/settings")({
  component: SettingsLayoutComponent,
});

function SettingsLayoutComponent() {
  return <Outlet />;
}
