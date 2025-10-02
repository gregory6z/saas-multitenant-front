import { createFileRoute } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/_authenticated/dashboard/chatbots/$id/sources/text")({
  component: SourcesTextPageComponent,
});

function SourcesTextPageComponent() {
  return <CreationLayout mode="chatbot" type="text" />;
}
