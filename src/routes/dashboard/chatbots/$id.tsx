import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import {
  Code,
  Database,
  FileText,
  Globe,
  MessageSquare,
  Monitor,
  Settings,
  Type,
} from "lucide-react";
import { ChatbotLayout } from "@/components/layouts/chatbot-layout";

export const Route = createFileRoute("/dashboard/chatbots/$id")({
  component: ChatbotLayoutComponent,
});

function ChatbotLayoutComponent() {
  const { id } = Route.useParams();
  const matches = useMatches();

  // Use TanStack Router's match system instead of string parsing
  const getCurrentSection = () => {
    const routeIds = matches.map((m) => m.routeId);

    if (routeIds.some((id) => id.includes("sources"))) return "sources";
    if (routeIds.some((id) => id.includes("settings"))) return "settings";
    if (routeIds.some((id) => id.includes("widget"))) return "widget";
    if (routeIds.some((id) => id.includes("playground"))) return "playground";

    return "playground";
  };

  const currentSection = getCurrentSection();

  // Configurar sidebar baseado na seção atual
  const getSidebarConfig = () => {
    const routeIds = matches.map((m) => m.routeId);

    // Helper to check if route is active using matches
    const isRouteActive = (path: string) => {
      return routeIds.some((id) => id.includes(path));
    };

    return {
      title:
        currentSection === "playground"
          ? "Playground"
          : currentSection === "sources"
            ? "Sources"
            : currentSection === "settings"
              ? "Settings"
              : "Widget",
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Chatbots", href: "/dashboard/chatbots" },
        { label: `Chatbot ${id}`, href: `/dashboard/chatbots/${id}` },
        {
          label:
            currentSection === "playground"
              ? "Playground"
              : currentSection === "sources"
                ? "Sources"
                : currentSection === "settings"
                  ? "Settings"
                  : "Widget",
          href: `/dashboard/chatbots/${id}/${currentSection}`,
        },
      ],
      sidebarSections: [
        {
          title: "Playground",
          url: `/dashboard/chatbots/${id}/playground`,
          icon: MessageSquare,
          isActive: currentSection === "playground",
        },
        {
          title: "Sources",
          icon: Database,
          isActive: currentSection === "sources",
          items: [
            {
              title: "Files",
              href: `/dashboard/chatbots/${id}/sources/files`,
              isActive: isRouteActive("files"),
              icon: FileText,
            },
            {
              title: "Text",
              href: `/dashboard/chatbots/${id}/sources/text`,
              isActive: isRouteActive("text"),
              icon: Type,
            },
            {
              title: "Websites",
              href: `/dashboard/chatbots/${id}/sources/websites`,
              isActive: isRouteActive("websites"),
              icon: Globe,
            },
            {
              title: "Knowledge Bases",
              href: `/dashboard/chatbots/${id}/sources/knowledge-bases`,
              isActive: isRouteActive("knowledge-bases"),
              icon: Database,
            },
          ],
        },
        {
          title: "Widget ou Embed",
          url: `/dashboard/chatbots/${id}/widget`,
          icon: Code,
          isActive: currentSection === "widget",
        },
        {
          title: "Settings",
          icon: Settings,
          isActive: currentSection === "settings",
          items: [
            {
              title: "General",
              href: `/dashboard/chatbots/${id}/settings/general`,
              isActive: isRouteActive("general"),
              icon: Settings,
            },
            {
              title: "AI",
              href: `/dashboard/chatbots/${id}/settings/ai`,
              isActive: isRouteActive("ai"),
              icon: MessageSquare,
            },
            {
              title: "Chat Interface",
              href: `/dashboard/chatbots/${id}/settings/chat-interface`,
              isActive: isRouteActive("chat-interface"),
              icon: Monitor,
            },
            {
              title: "Security",
              href: `/dashboard/chatbots/${id}/settings/security`,
              isActive: isRouteActive("security"),
              icon: Settings,
            },
          ],
        },
      ],
    };
  };

  const config = getSidebarConfig();

  return (
    <ChatbotLayout
      chatbotId={id}
      title={config.title}
      breadcrumbs={config.breadcrumbs}
      sidebarSections={config.sidebarSections}
    >
      <Outlet />
    </ChatbotLayout>
  );
}
