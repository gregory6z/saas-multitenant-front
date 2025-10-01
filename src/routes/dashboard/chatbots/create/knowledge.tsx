import { createFileRoute } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/dashboard/chatbots/create/knowledge")({
  component: CreateChatbotKnowledgePage,
});

function CreateChatbotKnowledgePage() {
  return <CreationLayout mode="chatbot" type="knowledge" />;
}
