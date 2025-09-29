import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/chatbots/create/files")({
  component: CreateChatbotFilesPage,
});

function CreateChatbotFilesPage() {
  return <CreationPage mode="chatbot" type="files" />;
}
