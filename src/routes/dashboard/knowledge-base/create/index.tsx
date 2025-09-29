import { createFileRoute, redirect } from "@tanstack/react-router";
import { CreationPage } from "@/components/creation-page";

export const Route = createFileRoute("/dashboard/knowledge-base/create/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/knowledge-base/create/files" });
  },
  component: CreateKnowledgeBaseIndexPage,
});

function CreateKnowledgeBaseIndexPage() {
  return <CreationPage mode="knowledge-base" type="index" />;
}
