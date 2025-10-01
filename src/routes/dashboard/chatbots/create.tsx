import { createFileRoute } from "@tanstack/react-router";
import { KnowledgeCreationLayout } from "@/components/layouts/knowledge-creation-layout";

export const Route = createFileRoute("/dashboard/chatbots/create")({
  component: CreateChatbotPage,
});

function CreateChatbotPage() {
  return <KnowledgeCreationLayout mode="chatbot" title="Chatbots" basePath="/dashboard/chatbots" />;
}
