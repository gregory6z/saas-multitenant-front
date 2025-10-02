import { createFileRoute } from "@tanstack/react-router";
import { CreationLayout } from "@/components/layouts/creation-layout";

export const Route = createFileRoute("/_authenticated/dashboard/knowledge-base/create/")({
  component: CreateKnowledgeBaseIndexPage,
});

function CreateKnowledgeBaseIndexPage() {
  return <CreationLayout mode="knowledge-base" type="index" />;
}
