import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/chatbots/$id/sources/websites")({
  component: SourcesWebsitesPageComponent,
});

function SourcesWebsitesPageComponent() {
  return <CreationPage mode="chatbot" type="websites" />;
}
