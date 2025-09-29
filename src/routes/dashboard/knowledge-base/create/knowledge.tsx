import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/knowledge-base/create/knowledge")({
  component: CreateKnowledgeBaseKnowledgePage,
});

function CreateKnowledgeBaseKnowledgePage() {
  return <CreationPage mode="knowledge-base" type="knowledge" />;
}
