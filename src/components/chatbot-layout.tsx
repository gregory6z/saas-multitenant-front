import { Link, useLocation } from "@tanstack/react-router";
import { Bot, Building2, Code, Database, Home, MessageSquare, Play, Settings } from "lucide-react";
import { CompanySwitcher } from "@/components/company-switcher";
import { NavMain } from "@/components/nav-main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";

interface ChatbotLayoutProps {
  children: React.ReactNode;
  chatbotId: string;
}

export function ChatbotLayout({ children, chatbotId }: ChatbotLayoutProps) {
  const location = useLocation();

  // Mock chatbot data - futuramente virá da API
  const chatbot = {
    id: chatbotId,
    name: `Chatbot ${chatbotId}`,
    status: "ativo",
  };

  // Teams data (same as DashboardHeader)
  const teams = [
    {
      name: "Demo Company",
      logo: Building2,
      plan: "Pro",
    },
    {
      name: "Acme Corp",
      logo: Building2,
      plan: "Enterprise",
    },
    {
      name: "TechStart",
      logo: Building2,
      plan: "Starter",
    },
  ];

  // Sidebar data seguindo o mesmo padrão do AppSidebar
  const chatbotNavData = [
    {
      title: "Playground",
      url: `/dashboard/chatbots/${chatbotId}/playground`,
      icon: Play,
      isActive: location.pathname === `/dashboard/chatbots/${chatbotId}/playground`,
    },
    {
      title: "Sources",
      url: `/dashboard/chatbots/${chatbotId}/sources`,
      icon: Database,
      isActive: location.pathname.includes(`/dashboard/chatbots/${chatbotId}/sources`),
      items: [
        {
          title: "Files",
          url: `/dashboard/chatbots/${chatbotId}/sources/files`,
          isActive: location.pathname === `/dashboard/chatbots/${chatbotId}/sources/files`,
        },
        {
          title: "Text",
          url: `/dashboard/chatbots/${chatbotId}/sources/text`,
          isActive: location.pathname === `/dashboard/chatbots/${chatbotId}/sources/text`,
        },
        {
          title: "Websites",
          url: `/dashboard/chatbots/${chatbotId}/sources/websites`,
          isActive: location.pathname === `/dashboard/chatbots/${chatbotId}/sources/websites`,
        },
        {
          title: "Knowledge Bases",
          url: `/dashboard/chatbots/${chatbotId}/sources/knowledge-bases`,
          isActive:
            location.pathname === `/dashboard/chatbots/${chatbotId}/sources/knowledge-bases`,
        },
      ],
    },
    {
      title: "Widget",
      url: `/dashboard/chatbots/${chatbotId}/widget`,
      icon: Code,
      isActive: location.pathname === `/dashboard/chatbots/${chatbotId}/widget`,
    },
    {
      title: "Configurações",
      url: `/dashboard/chatbots/${chatbotId}/settings`,
      icon: Settings,
      isActive: location.pathname.includes(`/dashboard/chatbots/${chatbotId}/settings`),
      items: [
        {
          title: "General",
          url: `/dashboard/chatbots/${chatbotId}/settings/general`,
          isActive: location.pathname === `/dashboard/chatbots/${chatbotId}/settings/general`,
        },
        {
          title: "AI",
          url: `/dashboard/chatbots/${chatbotId}/settings/ai`,
          isActive: location.pathname === `/dashboard/chatbots/${chatbotId}/settings/ai`,
        },
        {
          title: "Chat Interface",
          url: `/dashboard/chatbots/${chatbotId}/settings/chat-interface`,
          isActive:
            location.pathname === `/dashboard/chatbots/${chatbotId}/settings/chat-interface`,
        },
        {
          title: "Security",
          url: `/dashboard/chatbots/${chatbotId}/settings/security`,
          isActive: location.pathname === `/dashboard/chatbots/${chatbotId}/settings/security`,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header - Same as KnowledgeCreationLayout with custom breadcrumb */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card h-[60px]">
        <header className="bg-card border-b border-border px-4 py-2">
          <div className="flex items-center justify-between h-[44px]">
            {/* Left side - Company Switcher + Custom Breadcrumb */}
            <div className="flex items-center gap-3">
              <CompanySwitcher teams={teams} />

              {/* Custom Breadcrumb for Chatbot Flow */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard" className="flex items-center">
                    <Home className="w-4 h-4 mr-1" />
                    Dashboard
                  </Link>
                </Button>
                <span>/</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard/chatbots" className="flex items-center">
                    <Bot className="w-4 h-4 mr-1" />
                    Chatbots
                  </Link>
                </Button>
                <span>/</span>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium text-foreground">{chatbot.name}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {chatbot.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - User Avatar */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Gregory Praxedes</div>
                <div className="text-xs text-gray-500">gregory@demo.com</div>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt="Gregory Praxedes" />
                <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs">
                  GP
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 pt-[60px] h-full">
        <SidebarProvider>
          <Sidebar collapsible="icon" className="relative top-0 h-full">
            <SidebarContent>
              {/* Navegação principal usando o mesmo componente */}
              <NavMain items={chatbotNavData} />
            </SidebarContent>
            <SidebarRail />
          </Sidebar>

          <main className="flex-1 overflow-auto h-full">{children}</main>
        </SidebarProvider>
      </div>
    </div>
  );
}
