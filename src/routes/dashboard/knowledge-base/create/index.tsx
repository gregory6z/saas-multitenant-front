import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/knowledge-base/create/")({
  component: CreateKnowledgeBaseIndexPage,
});

function CreateKnowledgeBaseIndexPage() {
  return <CreationPage mode="knowledge-base" type="index" />;
}
