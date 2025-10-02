import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/chatbots/demo")({
  component: DemoRedirectComponent,
});

function DemoRedirectComponent() {
  // Redireciona para a rota dinâmica de demonstração
  return <Navigate to="/dashboard/chatbots/$id/playground" params={{ id: "demo" }} />;
}
