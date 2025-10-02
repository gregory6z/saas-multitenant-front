import { createFileRoute } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/_authenticated/dashboard/chatbots/$id/sources/knowledge-bases")({
  component: SourcesKnowledgeBasesPageComponent,
});

function SourcesKnowledgeBasesPageComponent() {
  return <CreationLayout mode="chatbot" type="knowledge" />;
}
