import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/knowledge-base/create/text")({
  component: CreateKnowledgeBaseTextPage,
});

function CreateKnowledgeBaseTextPage() {
  return <CreationPage mode="knowledge-base" type="text" />;
}
