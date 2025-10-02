import { createFileRoute } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/_authenticated/dashboard/chatbots/create/files")({
  component: CreateChatbotFilesPage,
});

function CreateChatbotFilesPage() {
  return <CreationLayout mode="chatbot" type="files" />;
}
