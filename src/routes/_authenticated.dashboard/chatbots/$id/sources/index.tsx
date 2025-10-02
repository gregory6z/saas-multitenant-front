import { createFileRoute, redirect } from "@tanstack/react-router";
import { FilesContent } from "@/components/knowledge/sources/files-content";

export const Route = createFileRoute("/_authenticated/dashboard/chatbots/$id/sources/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: `/dashboard/chatbots/${params.id}/sources/files` });
  },
  component: SourcesPageComponent,
});

function SourcesPageComponent() {
  return <FilesContent mode="chatbot" />;
}
