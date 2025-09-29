import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/chatbots/create/knowledge")({
  component: CreateChatbotKnowledgePage,
});

function CreateChatbotKnowledgePage() {
  return <CreationPage mode="chatbot" type="knowledge" />;
}
