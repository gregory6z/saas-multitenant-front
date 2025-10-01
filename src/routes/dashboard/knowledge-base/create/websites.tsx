import { createFileRoute } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/dashboard/knowledge-base/create/websites")({
  component: CreateKnowledgeBaseWebsitesPage,
});

function CreateKnowledgeBaseWebsitesPage() {
  return <CreationLayout mode="knowledge-base" type="websites" />;
}
