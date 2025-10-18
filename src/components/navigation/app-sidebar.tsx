import type * as React from "react";
import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { CompanySwitcher } from "@/components/navigation/company-switcher";
import { NavGroup } from "@/components/navigation/nav-group";
import { NavUser } from "@/components/navigation/nav-user";
import { baseNavGroups } from "@/components/navigation/sidebar-data";
import type { NavGroup as NavGroupType, Team } from "@/components/navigation/types";
import { useCurrentUserRole } from "@/hooks/use-team-members";
import { useUser } from "@/hooks/use-users";
import { useSubscription } from "@/hooks/use-subscription";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation("common");
  const { canManageTeam } = useCurrentUserRole();
  const { data: user } = useUser();
  const { subscription } = useSubscription();

  // TODO: Implement useTenants hook or get teams data
  // For now, using mock data
  const teams: Team[] = [
    {
      id: "1",
      name: "My Organization",
      logo: Building2,
      plan: subscription?.planId || "Free",
      subdomain: "my-org",
    },
  ];

  // Process nav groups with translations and permissions
  const processedNavGroups: NavGroupType[] = baseNavGroups.map((group) => ({
    ...group,
    title: t(`sidebar.groups.${group.title}`),
    items: group.items
      .map((item) => {
        // Handle collapsible items (with subitems)
        if (item.items) {
          // Filter subitems based on permissions
          let filteredSubItems = item.items;
          if (item.title === "workplaceSettings") {
            filteredSubItems = item.items.filter((subItem) => {
              if (subItem.title === "members") {
                return canManageTeam;
              }
              return true;
            });
          }

          return {
            ...item,
            title: t(`sidebar.${item.title}`),
            items: filteredSubItems.map((subItem) => ({
              ...subItem,
              title: t(`sidebar.${subItem.title}`),
            })),
          };
        }

        // Handle simple link items
        return {
          ...item,
          title: t(`sidebar.${item.title}`),
        };
      })
      .filter((item) => {
        // Remove empty collapsible items
        if (item.items && item.items.length === 0) {
          return false;
        }
        return true;
      }),
  }));

  // User data for footer
  const userData = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: "/avatars/default.jpg", // TODO: Implement user avatar
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanySwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        {processedNavGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
