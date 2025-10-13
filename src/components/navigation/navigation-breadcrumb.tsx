import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, Slash } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavigationBreadcrumb() {
  const { t } = useTranslation("common");
  const location = useLocation();

  // Mock data for workspaces and chatbots
  const currentWorkspace = {
    name: "gregoryTest",
    plan: "Free",
  };

  const availableWorkspaces = [
    { id: "1", name: "gregoryTest", plan: "Free" },
    { id: "2", name: "My Company", plan: "Pro" },
    { id: "3", name: "Client Project", plan: "Enterprise" },
  ];

  const chatbots = [
    { id: "1", name: "Customer Support Bot" },
    { id: "2", name: "Sales Assistant" },
    { id: "3", name: "FAQ Bot" },
  ];

  const knowledgeBases = [
    { id: "1", name: "Customer Support KB" },
    { id: "2", name: "Product Documentation" },
    { id: "3", name: "FAQ Website" },
  ];

  // Determine current context based on route
  const getCurrentContext = () => {
    const path = location.pathname;

    if (path.startsWith("/dashboard/chatbots/") && path.includes("/")) {
      const segments = path.split("/");
      const chatbotId = segments[3];
      if (chatbotId && chatbotId !== "create") {
        const chatbot = chatbots.find((c) => c.id === chatbotId);
        return {
          type: "chatbot",
          id: chatbotId,
          name: chatbot?.name || `Chatbot ${chatbotId}`,
          context: getSubContext(path),
        };
      }
    }

    if (path.startsWith("/dashboard/knowledge-base/") && path.includes("/")) {
      const segments = path.split("/");
      const kbId = segments[3];
      if (kbId && kbId !== "create") {
        const kb = knowledgeBases.find((k) => k.id === kbId);
        return {
          type: "knowledge-base",
          id: kbId,
          name: kb?.name || `KB ${kbId}`,
          context: getSubContext(path),
        };
      }
    }

    return {
      type: "dashboard",
      context: getDashboardContext(path),
    };
  };

  const getSubContext = (path: string) => {
    if (path.includes("/analytics")) return "Analytics";
    if (path.includes("/settings")) return "Settings";
    if (path.includes("/testing")) return "Testing";
    if (path.includes("/knowledge-base")) return "Knowledge Base";
    if (path.includes("/files")) return "Files";
    if (path.includes("/text")) return "Text";
    if (path.includes("/website")) return "Website";
    return "Overview";
  };

  const getDashboardContext = (path: string) => {
    if (path.includes("/chatbots")) return "Chatbots";
    if (path.includes("/knowledge-base")) return "Knowledge Base";
    if (path.includes("/usages")) return "Analytics";
    if (path.includes("/settings")) return "Settings";
    return "Dashboard";
  };

  const currentContext = getCurrentContext();

  return (
    <div className="flex items-center h-12 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">M</span>
          </div>
        </Link>

        <Slash className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Workspace */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2 text-sm font-medium">
              {currentWorkspace.name}
              <span className="ml-1 text-xs text-muted-foreground">{currentWorkspace.plan}</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {t("breadcrumb.selectWorkspace")}
            </div>
            <DropdownMenuSeparator />
            {availableWorkspaces.map((workspace) => (
              <DropdownMenuItem key={workspace.id} className="cursor-pointer">
                <div className="flex items-center justify-between w-full">
                  <span>{workspace.name}</span>
                  <span className="text-xs text-muted-foreground">{workspace.plan}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {/* TODO: Implement create tenant route */}
            {/* <DropdownMenuItem asChild>
              <Link to="/dashboard/create-tenant" className="cursor-pointer">
                {t("breadcrumb.createWorkspace")}
              </Link>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>

        {currentContext.type !== "dashboard" && (
          <>
            <Slash className="w-4 h-4 text-muted-foreground" />

            {/* Chatbot or Knowledge Base */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 px-2 text-sm font-medium max-w-48 truncate">
                  {currentContext.name}
                  <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  {currentContext.type === "chatbot"
                    ? t("breadcrumb.selectChatbot")
                    : t("breadcrumb.selectKnowledgeBase")}
                </div>
                <DropdownMenuSeparator />
                {(currentContext.type === "chatbot" ? chatbots : knowledgeBases).map((item) => (
                  <DropdownMenuItem key={item.id} className="cursor-pointer">
                    <div
                      className="w-full truncate"
                      onClick={() => {
                        // Navigate programmatically or use proper route handling
                        window.location.href =
                          currentContext.type === "chatbot"
                            ? `/dashboard/chatbots/${item.id}`
                            : `/dashboard/knowledge-base/${item.id}`;
                      }}
                    >
                      {item.name}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to={
                      currentContext.type === "chatbot"
                        ? "/dashboard/chatbots/create"
                        : "/dashboard/knowledge-base/create"
                    }
                    className="cursor-pointer"
                  >
                    {currentContext.type === "chatbot"
                      ? t("breadcrumb.createChatbot")
                      : t("breadcrumb.createKnowledgeBase")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      {/* Context/Status */}
      {currentContext.context && (
        <div className="ml-auto flex items-center">
          <div className="h-4 w-px bg-border mx-3" />
          <span className="text-sm text-muted-foreground">{currentContext.context}</span>
        </div>
      )}
    </div>
  );
}
