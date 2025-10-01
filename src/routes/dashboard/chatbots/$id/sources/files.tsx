import { createFileRoute } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/dashboard/chatbots/$id/sources/files")({
  component: SourcesFilesPageComponent,
});

function SourcesFilesPageComponent() {
  return <CreationLayout mode="chatbot" type="files" />;
}
