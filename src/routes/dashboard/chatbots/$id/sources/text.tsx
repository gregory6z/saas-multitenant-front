import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/chatbots/$id/sources/text")({
  component: SourcesTextPageComponent,
});

function SourcesTextPageComponent() {
  return <CreationPage mode="chatbot" type="text" />;
}
