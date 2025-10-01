import { createFileRoute } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/dashboard/knowledge-base/create/knowledge")({
  component: CreateKnowledgeBaseKnowledgePage,
});

function CreateKnowledgeBaseKnowledgePage() {
  return <CreationLayout mode="knowledge-base" type="knowledge" />;
}
