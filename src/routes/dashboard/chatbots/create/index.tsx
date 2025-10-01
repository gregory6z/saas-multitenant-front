import { createFileRoute, redirect } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/dashboard/chatbots/create/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/chatbots/create/files" });
  },
  component: CreateChatbotIndexPage,
});

function CreateChatbotIndexPage() {
  return <CreationLayout mode="chatbot" type="index" />;
}
