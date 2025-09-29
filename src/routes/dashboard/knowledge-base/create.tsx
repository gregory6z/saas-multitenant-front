import { createFileRoute, redirect } from "@tanstack/react-router";
import { KnowledgeCreationLayout } from "@/components/knowledge-creation-layout";

export const Route = createFileRoute("/dashboard/knowledge-base/create")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/knowledge-base/create/files" });
  },
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
