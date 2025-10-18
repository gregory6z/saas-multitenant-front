import { BarChart3, Bot, Database, Settings } from "lucide-react";
import type { NavGroup } from "./types";

/**
 * Base navigation structure (without translations and permissions)
 * Will be processed by app-sidebar.tsx to add i18n and permission filtering
 */
export const baseNavGroups: NavGroup[] = [
  {
    title: "general",
    items: [
      {
        title: "chatbots",
        url: "/dashboard/chatbots",
        icon: Bot,
      },
      {
        title: "knowledgeBase",
        url: "/dashboard/knowledge-base",
        icon: Database,
      },
      {
        title: "usages",
        url: "/dashboard/usages",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "settings",
    items: [
      {
        title: "workplaceSettings",
        icon: Settings,
        items: [
          {
            title: "general",
            url: "/dashboard/settings/general",
          },
          {
            title: "members",
            url: "/dashboard/settings/members",
          },
          {
            title: "plans",
            url: "/dashboard/settings/plans",
          },
          {
            title: "billing",
            url: "/dashboard/settings/billing",
          },
        ],
      },
    ],
  },
];
