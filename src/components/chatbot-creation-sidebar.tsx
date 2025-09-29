import { Link, useLocation } from "@tanstack/react-router";
import { Database, Files, Globe, Type } from "lucide-react";
import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

interface ChatbotCreationSidebarProps extends React.ComponentProps<typeof Sidebar> {
  mode?: "knowledge-base" | "chatbot";
}

export function ChatbotCreationSidebar({
  mode = "knowledge-base",
  ...props
}: ChatbotCreationSidebarProps) {
  const location = useLocation();

  // Generate routes based on mode
  const getRoutes = () => {
    const basePath =
      mode === "chatbot" ? "/dashboard/chatbots/create" : "/dashboard/knowledge-base/create";
    return {
      files: `${basePath}/files`,
      text: `${basePath}/text`,
      websites: `${basePath}/websites`,
      knowledge: `${basePath}/knowledge`,
    };
  };

  const routes = getRoutes();

  // Sources data for chatbot creation
  const sourcesData = [
    {
      title: "Arquivos",
      icon: Files,
      key: "files",
      color: "text-blue-600",
      route: routes.files,
    },
    {
      title: "Texto",
      icon: Type,
      key: "text",
      color: "text-green-600",
      route: routes.text,
    },
    {
      title: "Websites",
      icon: Globe,
      key: "websites",
      color: "text-purple-600",
      route: routes.websites,
    },
    {
      title: "Knowledge Bases",
      icon: Database,
      key: "knowledge",
      color: "text-orange-600",
      route: routes.knowledge,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="relative top-0 h-full" {...props}>
      <SidebarContent>
        {/* Sources Menu - Navigation with routes */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium">Sources</SidebarGroupLabel>
          <SidebarMenu>
            {sourcesData.map((item) => {
              const isActive = location.pathname === item.route;

              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={isActive}
                    className="cursor-pointer text-base h-9"
                  >
                    <Link to={item.route}>
                      <item.icon
                        className={`w-5 h-5 ${isActive ? "text-primary" : item.color}`}
                        strokeWidth={isActive ? 2.5 : 1.5}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
