import { createFileRoute, redirect } from "@tanstack/react-router";
import { KnowledgeCreationLayout } from "@/components/knowledge-creation-layout";

export const Route = createFileRoute("/dashboard/chatbots/create")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/chatbots/create/files" });
  },
  component: CreateChatbotPage,
});

function CreateChatbotPage() {
  return <KnowledgeCreationLayout mode="chatbot" title="Chatbots" basePath="/dashboard/chatbots" />;
}
