import { createFileRoute } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/_authenticated/dashboard/chatbots/$id/sources/websites")({
  component: SourcesWebsitesPageComponent,
});

function SourcesWebsitesPageComponent() {
  return <CreationLayout mode="chatbot" type="websites" />;
}
