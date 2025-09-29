import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/chatbots/create/websites")({
  component: CreateChatbotWebsitesPage,
});

function CreateChatbotWebsitesPage() {
  return <CreationPage mode="chatbot" type="websites" />;
}
