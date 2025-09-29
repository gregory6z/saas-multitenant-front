import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/chatbots/$id/")({
  component: ChatbotIndexComponent,
});

function ChatbotIndexComponent() {
  const { id } = Route.useParams();

  // Redireciona para playground por padrão
  return <Navigate to="/dashboard/chatbots/$id/playground" params={{ id }} />;
}
