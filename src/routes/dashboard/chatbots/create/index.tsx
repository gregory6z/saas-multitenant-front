import { createFileRoute, redirect } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/chatbots/create/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/chatbots/create/files" });
  },
  component: CreateChatbotIndexPage,
});

function CreateChatbotIndexPage() {
  return <CreationPage mode="chatbot" type="index" />;
}
