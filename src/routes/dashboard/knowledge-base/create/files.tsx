import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/knowledge-base/create/files")({
  component: CreateKnowledgeBaseFilesPage,
});

function CreateKnowledgeBaseFilesPage() {
  return <CreationPage mode="knowledge-base" type="files" />;
}
