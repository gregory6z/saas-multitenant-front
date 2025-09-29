import { createFileRoute, redirect } from "@tanstack/react-router";
import { FilesContent } from "@/components/content/files-content";

export const Route = createFileRoute("/dashboard/chatbots/$id/sources/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: `/dashboard/chatbots/${params.id}/sources/files` });
  },
  component: SourcesPageComponent,
});

function SourcesPageComponent() {
  return <FilesContent mode="chatbot" />;
}
