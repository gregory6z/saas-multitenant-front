import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/chatbots/$id/sources/knowledge-bases")({
  component: SourcesKnowledgeBasesPageComponent,
});

function SourcesKnowledgeBasesPageComponent() {
  return <CreationPage mode="chatbot" type="knowledge" />;
}
