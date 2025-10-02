import { Link, Outlet } from "@tanstack/react-router";
import { Bot, Building2, Home } from "lucide-react";
import { ChatbotCreationSidebar } from "@/components/chatbot/chatbot-creation-sidebar";
import { CompanySwitcher } from "@/components/navigation/company-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";

interface KnowledgeCreationLayoutProps {
  mode: "knowledge-base" | "chatbot";
  title: string;
  basePath: string;
}

export function KnowledgeCreationLayout({ mode, title, basePath }: KnowledgeCreationLayoutProps) {
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

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header - Same as DashboardHeader but with custom breadcrumb */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card h-[60px]">
        <header className="bg-card border-b border-border px-4 py-2">
          <div className="flex items-center justify-between h-[44px]">
            {/* Left side - Logo + Company Switcher + Custom Breadcrumb */}
            <div className="flex items-center gap-4">
              {/* RagBoost Logo */}
              <Link to="/dashboard" className="flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary hover:text-primary/80 transition-colors" />
              </Link>

              {/* Separator */}
              <div className="w-px h-6 bg-border"></div>

              <CompanySwitcher teams={teams} />

              {/* Custom Breadcrumb for Create Flow */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard" className="flex items-center">
                    <Home className="w-4 h-4 mr-1" />
                    Dashboard
                  </Link>
                </Button>
                <span>/</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={basePath} className="flex items-center">
                    {title}
                  </Link>
                </Button>
                <span>/</span>
                <span className="font-medium text-foreground">Criar Nova</span>
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
      <div className="flex flex-1 pt-[60px] h-full overflow-hidden">
        <SidebarProvider>
          <ChatbotCreationSidebar
            mode={mode}
            className="fixed left-0 h-[calc(100vh-60px)] top-[60px]"
          />

          <div className="flex-1 overflow-y-auto ml-[--sidebar-width]">
            <Outlet />
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
