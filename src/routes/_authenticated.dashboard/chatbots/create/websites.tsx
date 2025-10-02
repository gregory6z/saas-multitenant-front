import { createFileRoute } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/_authenticated/dashboard/chatbots/create/websites")({
  component: CreateChatbotWebsitesPage,
});

function CreateChatbotWebsitesPage() {
  return <CreationLayout mode="chatbot" type="websites" />;
}
