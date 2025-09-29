import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
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
  const location = useLocation();

  // Determinar qual seção está ativa baseada na URL
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes("/sources")) return "sources";
    if (path.includes("/settings")) return "settings";
    if (path.includes("/playground")) return "playground";
    if (path.includes("/widget")) return "widget";
    return "playground";
  };

  const currentSection = getCurrentSection();

  // Configurar sidebar baseado na seção atual
  const getSidebarConfig = () => {
    // Sempre usar sidebar completa com accordions para manter consistência
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
          href: location.pathname,
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
              isActive: location.pathname.includes("/sources/files"),
              icon: FileText,
            },
            {
              title: "Text",
              href: `/dashboard/chatbots/${id}/sources/text`,
              isActive: location.pathname.includes("/sources/text"),
              icon: Type,
            },
            {
              title: "Websites",
              href: `/dashboard/chatbots/${id}/sources/websites`,
              isActive: location.pathname.includes("/sources/websites"),
              icon: Globe,
            },
            {
              title: "Knowledge Bases",
              href: `/dashboard/chatbots/${id}/sources/knowledge-bases`,
              isActive: location.pathname.includes("/sources/knowledge-bases"),
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
              isActive: location.pathname.includes("/settings/general"),
              icon: Settings,
            },
            {
              title: "AI",
              href: `/dashboard/chatbots/${id}/settings/ai`,
              isActive: location.pathname.includes("/settings/ai"),
              icon: MessageSquare,
            },
            {
              title: "Chat Interface",
              href: `/dashboard/chatbots/${id}/settings/chat-interface`,
              isActive: location.pathname.includes("/settings/chat-interface"),
              icon: Monitor,
            },
            {
              title: "Security",
              href: `/dashboard/chatbots/${id}/settings/security`,
              isActive: location.pathname.includes("/settings/security"),
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
