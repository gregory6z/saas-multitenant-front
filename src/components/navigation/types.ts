import type { LinkProps } from "@tanstack/react-router";

export type User = {
  name: string;
  email: string;
  avatar: string;
};

export type Team = {
  id?: string;
  name: string;
  logo: React.ElementType;
  plan: string;
  subdomain?: string;
};

type BaseNavItem = {
  title: string;
  badge?: string;
  icon?: React.ElementType;
};

export type NavLink = BaseNavItem & {
  url: LinkProps["to"] | (string & {});
  items?: never;
};

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps["to"] | (string & {}) })[];
  url?: never;
};

export type NavItem = NavCollapsible | NavLink;

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type SidebarData = {
  user: User;
  teams: Team[];
  navGroups: NavGroup[];
};
