import { createFileRoute } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/_authenticated/dashboard/chatbots/create/text")({
  component: CreateChatbotTextPage,
});

function CreateChatbotTextPage() {
  return <CreationLayout mode="chatbot" type="text" />;
}
