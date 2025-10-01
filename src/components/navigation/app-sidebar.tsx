import { useLocation } from "@tanstack/react-router";
import { BarChart3, Bot, Database, Settings } from "lucide-react";
import type * as React from "react";
import { useTranslation } from "react-i18next";

import { NavMain } from "@/components/navigation/nav-main";
import { NavProjects } from "@/components/navigation/nav-projects";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

// Simplified sidebar data
const data = {
  navMain: [
    {
      title: "Chatbots",
      url: "/dashboard/chatbots",
      icon: Bot,
    },
    {
      title: "Knowledge Base",
      url: "/dashboard/knowledge-base",
      icon: Database,
    },
    {
      title: "Usages",
      url: "/dashboard/usages",
      icon: BarChart3,
    },
    {
      title: "Workplace Settings",
      url: "/dashboard/settings",
      icon: Settings,
      items: [
        { title: "General", url: "/dashboard/settings/general" },
        { title: "Members", url: "/dashboard/settings/members" },
        { title: "Plans", url: "/dashboard/settings/plans" },
        { title: "Billing", url: "/dashboard/settings/billing" },
        { title: "Security", url: "/dashboard/settings/security" },
      ],
    },
  ],
  chatbots: [
    {
      name: "Suporte Cliente",
      url: "/dashboard/chatbots/suporte-cliente",
      icon: Bot,
    },
    {
      name: "Vendas Bot",
      url: "/dashboard/chatbots/vendas",
      icon: Bot,
    },
    {
      name: "FAQ Automático",
      url: "/dashboard/chatbots/faq",
      icon: Bot,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation("common");
  const location = useLocation();

  // Update data with translations and active state
  const translatedData = {
    ...data,
    navMain: data.navMain.map((item) => {
      let translationKey = "";
      switch (item.title) {
        case "Chatbots":
          translationKey = "sidebar.chatbots";
          break;
        case "Knowledge Base":
          translationKey = "sidebar.knowledgeBase";
          break;
        case "Usages":
          translationKey = "sidebar.usages";
          break;
        case "Workplace Settings":
          translationKey = "sidebar.workplaceSettings";
          break;
        default:
          translationKey = `sidebar.${item.title.toLowerCase()}`;
      }

      // Check if current item is active
      const isActive =
        location.pathname === item.url ||
        item.items?.some((subItem) => location.pathname === subItem.url);

      return {
        ...item,
        title: t(translationKey),
        isActive,
        items: item.items?.map((subItem) => ({
          ...subItem,
          title: t(`sidebar.${subItem.title.toLowerCase()}`),
          isActive: location.pathname === subItem.url,
        })),
      };
    }),
    chatbots: data.chatbots.map((chatbot) => ({
      ...chatbot,
      // Keep chatbot names as they are for now
    })),
  };

  return (
    <Sidebar collapsible="icon" className="relative top-0 h-full" {...props}>
      <SidebarContent>
        <NavMain items={translatedData.navMain} />
        <NavProjects projects={translatedData.chatbots} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
