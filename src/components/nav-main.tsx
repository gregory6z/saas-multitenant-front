"use client";

import { Link } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      isActive?: boolean;
    }[];
  }[];
}) {
  const { t } = useTranslation("common");

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-medium">{t("sidebar.mainMenu")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;

          if (hasSubItems) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="cursor-pointer text-base h-9"
                      isActive={item.isActive}
                    >
                      {item.icon && (
                        <item.icon
                          className={`w-5 h-5 ${item.isActive ? "text-primary" : ""}`}
                          strokeWidth={item.isActive ? 2.5 : 1.5}
                        />
                      )}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={subItem.isActive}
                            className="text-base h-9"
                          >
                            <Link
                              to={subItem.url}
                              className={`cursor-pointer relative ${
                                subItem.isActive
                                  ? 'pl-3 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary before:content-[""]'
                                  : ""
                              }`}
                            >
                              <span>{subItem.title}</span>
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
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className="cursor-pointer text-base h-9"
                isActive={item.isActive}
              >
                <Link to={item.url}>
                  {item.icon && (
                    <item.icon
                      className={`w-5 h-5 ${item.isActive ? "text-primary" : ""}`}
                      strokeWidth={item.isActive ? 2.5 : 1.5}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
