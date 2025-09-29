import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/chatbots/$id/settings/")({
  component: SettingsIndexComponent,
});

function SettingsIndexComponent() {
  const { id } = Route.useParams();

  // Redireciona para general por padrão
  return <Navigate to="/dashboard/chatbots/$id/settings/general" params={{ id }} />;
}
