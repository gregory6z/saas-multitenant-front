import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/chatbots/$id/sources/files")({
  component: SourcesFilesPageComponent,
});

function SourcesFilesPageComponent() {
  return <CreationPage mode="chatbot" type="files" />;
}
