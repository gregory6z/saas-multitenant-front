import { createFileRoute } from "@tanstack/react-router";
import { KnowledgeCreationLayout } from "@/components/layouts/knowledge-creation-layout";

export const Route = createFileRoute("/_authenticated/dashboard/knowledge-base/create")({
  component: CreateKnowledgeBasePage,
});

function CreateKnowledgeBasePage() {
  return (
    <KnowledgeCreationLayout
      mode="knowledge-base"
      title="Knowledge Base"
      basePath="/dashboard/knowledge-base"
    />
  );
}
