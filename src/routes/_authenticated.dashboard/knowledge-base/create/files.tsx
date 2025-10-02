import { createFileRoute } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/_authenticated/dashboard/knowledge-base/create/files")({
  component: CreateKnowledgeBaseFilesPage,
});

function CreateKnowledgeBaseFilesPage() {
  return <CreationLayout mode="knowledge-base" type="files" />;
}
