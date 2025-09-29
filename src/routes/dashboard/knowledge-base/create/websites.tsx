import { createFileRoute } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/knowledge-base/create/websites")({
  component: CreateKnowledgeBaseWebsitesPage,
});

function CreateKnowledgeBaseWebsitesPage() {
  return <CreationPage mode="knowledge-base" type="websites" />;
}
