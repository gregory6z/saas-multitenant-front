import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/chatbots/create/text")({
  component: CreateChatbotTextPage,
});

function CreateChatbotTextPage() {
  return <CreationPage mode="chatbot" type="text" />;
}
