import { createFileRoute } from "@tanstack/react-router";
import { WidgetContent } from "@/components/chatbot-content/widget-content";

export const Route = createFileRoute("/dashboard/chatbots/$id/widget")({
  component: WidgetPageComponent,
});

function WidgetPageComponent() {
  const { id } = Route.useParams();

  return <WidgetContent chatbotId={id} />;
}
