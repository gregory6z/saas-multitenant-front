import { Link, useLocation } from "@tanstack/react-router";
import { ChevronsUpDown, Plus, Slash } from "lucide-react";
import type * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BreadcrumbSwitcherProps {
  type: "workspace" | "chatbot" | "knowledge-base";
  items: Array<{
    id: string;
    name: string;
    subtitle?: string;
    icon?: React.ElementType;
  }>;
  currentItem: {
    id: string;
    name: string;
    subtitle?: string;
    icon?: React.ElementType;
  };
  onItemChange?: (item: {
    id: string;
    name: string;
    subtitle?: string;
    icon?: React.ElementType;
  }) => void;
  createUrl?: string;
  createLabel?: string;
}

export function BreadcrumbSwitcher({
  type,
  items,
  currentItem,
  onItemChange,
  createUrl,
  createLabel,
}: BreadcrumbSwitcherProps) {
  const { t } = useTranslation("common");

  const getDropdownLabel = () => {
    switch (type) {
      case "workspace":
        return t("breadcrumb.selectWorkspace");
      case "chatbot":
        return t("breadcrumb.selectChatbot");
      case "knowledge-base":
        return t("breadcrumb.selectKnowledgeBase");
      default:
        return "";
    }
  };

  const getCreateLabel = () => {
    if (createLabel) return createLabel;
    switch (type) {
      case "workspace":
        return t("breadcrumb.createWorkspace");
      case "chatbot":
        return t("breadcrumb.createChatbot");
      case "knowledge-base":
        return t("breadcrumb.createKnowledgeBase");
      default:
        return "";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 px-3 justify-start gap-2 hover:bg-gray-50 focus:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {currentItem.icon && (
            <div className="bg-blue-500 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
              <currentItem.icon className="size-4" />
            </div>
          )}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{currentItem.name}</span>
            {currentItem.subtitle && (
              <span className="truncate text-xs text-muted-foreground">{currentItem.subtitle}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-lg" align="start" sideOffset={4}>
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          {getDropdownLabel()}
        </DropdownMenuLabel>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => onItemChange?.(item)}
            className="gap-2 p-2 cursor-pointer"
          >
            {item.icon && (
              <div className="flex size-6 items-center justify-center rounded-md border">
                <item.icon className="size-3.5 shrink-0" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="truncate font-medium">{item.name}</div>
              {item.subtitle && (
                <div className="truncate text-xs text-muted-foreground">{item.subtitle}</div>
              )}
            </div>
          </DropdownMenuItem>
        ))}
        {createUrl && createLabel && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2 p-2">
              <Link to={createUrl} className="cursor-pointer">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">{getCreateLabel()}</div>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function BreadcrumbNavigation() {
  const { t } = useTranslation("common");
  const location = useLocation();

  // Mock data
  const workspaces = [
    { id: "1", name: "gregoryTest", subtitle: "Free" },
    { id: "2", name: "My Company", subtitle: "Pro" },
    { id: "3", name: "Client Project", subtitle: "Enterprise" },
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

  const currentWorkspace = workspaces[0];

  // Determine current context based on route
  const getCurrentContext = () => {
    const path = location.pathname;

    if (path.startsWith("/dashboard/chatbots/") && path.includes("/")) {
      const segments = path.split("/");
      const chatbotId = segments[3];
      if (chatbotId && chatbotId !== "create") {
        const chatbot = chatbots.find((c) => c.id === chatbotId);
        return {
          type: "chatbot" as const,
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
          type: "knowledge-base" as const,
          id: kbId,
          name: kb?.name || `KB ${kbId}`,
          context: getSubContext(path),
        };
      }
    }

    return {
      type: "dashboard" as const,
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
    <div className="flex items-center gap-1 text-sm">
      {/* Workspace */}
      <BreadcrumbSwitcher
        type="workspace"
        items={workspaces}
        currentItem={currentWorkspace}
        createUrl="/dashboard/create-tenant"
        createLabel={t("breadcrumb.createWorkspace")}
      />

      {/* Chatbot or Knowledge Base */}
      {currentContext.type !== "dashboard" && (
        <>
          <Slash className="w-4 h-4 text-muted-foreground" />

          <BreadcrumbSwitcher
            type={currentContext.type}
            items={currentContext.type === "chatbot" ? chatbots : knowledgeBases}
            currentItem={{
              id: currentContext.id || "",
              name: currentContext.name || "",
            }}
            createUrl={
              currentContext.type === "chatbot"
                ? "/dashboard/chatbots/create/knowledge-base"
                : "/dashboard/knowledge-base/create"
            }
          />
        </>
      )}

      {/* Context/Status */}
      {currentContext.context && (
        <>
          <div className="h-4 w-px bg-border mx-2" />
          <span className="text-sm text-muted-foreground">{currentContext.context}</span>
        </>
      )}
    </div>
  );
}
