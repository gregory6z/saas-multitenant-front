import { createFileRoute } from "@tanstack/react-router";
import { PlaygroundContent } from "@/components/chatbot/content/playground-content";

export const Route = createFileRoute("/_authenticated/dashboard/chatbots/$id/playground")({
  component: PlaygroundPageComponent,
});

function PlaygroundPageComponent() {
  const { id } = Route.useParams();

  return <PlaygroundContent chatbotId={id} />;
}
