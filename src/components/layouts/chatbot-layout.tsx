import { Link } from "@tanstack/react-router";
import { Bot, Building2, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { CompanySwitcher } from "@/components/navigation/company-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";

interface Breadcrumb {
  label: string;
  href: string;
}

interface SidebarSection {
  title: string;
  url?: string;
  icon?: React.ElementType;
  isActive?: boolean;
  items?: Array<{
    title: string;
    href: string;
    isActive: boolean;
    icon?: React.ElementType;
  }>;
}

interface ChatbotLayoutProps {
  chatbotId: string;
  title: string;
  breadcrumbs: Breadcrumb[];
  sidebarSections?: SidebarSection[] | null;
  children: ReactNode;
}

export function ChatbotLayout({ breadcrumbs, sidebarSections, children }: ChatbotLayoutProps) {
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
      {/* Header - Same as KnowledgeCreationLayout with custom breadcrumb */}
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

              {/* Dynamic Breadcrumb */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {index > 0 && <span>/</span>}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="font-medium text-foreground">{breadcrumb.label}</span>
                    ) : (
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
                      </Button>
                    )}
                  </div>
                ))}
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
        {sidebarSections ? (
          <SidebarProvider>
            <Sidebar collapsible="icon" className="fixed left-0 h-[calc(100vh-60px)] top-[60px]">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-sm font-medium">
                    Chatbot Menu
                  </SidebarGroupLabel>
                  <SidebarMenu>
                    {sidebarSections.map((section, _index) => {
                      const hasSubItems = section.items && section.items.length > 0;

                      if (hasSubItems) {
                        return (
                          <Collapsible
                            key={section.title}
                            asChild
                            defaultOpen={section.isActive}
                            className="group/collapsible"
                          >
                            <SidebarMenuItem>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                  tooltip={section.title}
                                  className="cursor-pointer text-base h-9"
                                  isActive={section.isActive}
                                >
                                  {section.icon && (
                                    <section.icon
                                      className={`w-5 h-5 ${section.isActive ? "text-primary" : ""}`}
                                      strokeWidth={section.isActive ? 2.5 : 1.5}
                                    />
                                  )}
                                  <span>{section.title}</span>
                                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {section.items?.map((item, itemIndex) => (
                                    <SidebarMenuSubItem key={itemIndex}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={item.isActive}
                                        className="text-base h-9"
                                      >
                                        <Link
                                          to={item.href}
                                          className={`cursor-pointer relative ${
                                            item.isActive
                                              ? 'pl-3 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary before:content-[""]'
                                              : ""
                                          }`}
                                        >
                                          {item.icon && <item.icon className="w-4 h-4" />}
                                          <span>{item.title}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </SidebarMenuItem>
                          </Collapsible>
                        );
                      }

                      // Item simples sem subitens
                      return (
                        <SidebarMenuItem key={section.title}>
                          <SidebarMenuButton
                            tooltip={section.title}
                            asChild
                            className="cursor-pointer text-base h-9"
                            isActive={section.isActive}
                          >
                            <Link to={section.url || "#"}>
                              {section.icon && (
                                <section.icon
                                  className={`w-5 h-5 ${section.isActive ? "text-primary" : ""}`}
                                  strokeWidth={section.isActive ? 2.5 : 1.5}
                                />
                              )}
                              <span>{section.title}</span>
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

            <main className="flex-1 overflow-y-auto ml-[--sidebar-width]">{children}</main>
          </SidebarProvider>
        ) : (
          <main className="flex-1 overflow-y-auto">{children}</main>
        )}
      </div>
    </div>
  );
}
