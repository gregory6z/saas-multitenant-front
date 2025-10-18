import { Link } from "@tanstack/react-router";
import { ChevronsUpDown, Plus, Users } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { JoinTenantDialog } from "@/components/features/settings/dialogs/join-tenant-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSubscription } from "@/hooks/use-subscription";
import { getTenantSubdomainUrl } from "@/lib/url-utils";

// Mapeamento de planId para nome legível (PT-BR)
const PLAN_NAMES: Record<string, string> = {
  "plan-trial": "Teste",
  "plan-starter": "Inicial",
  "plan-pro": "Profissional",
  "plan-enterprise": "Empresarial",
};

export function CompanySwitcher({
  teams,
}: {
  teams: {
    id?: string;
    name: string;
    logo: React.ElementType;
    plan: string;
    subdomain?: string;
  }[];
}) {
  const { t } = useTranslation("common");
  const { isMobile } = useSidebar();
  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false);
  const { subscription, isLoading: subscriptionLoading } = useSubscription();

  // Detecta tenant ativo baseado no subdomain da URL atual
  const hostname = window.location.hostname;
  const currentSubdomain = hostname.includes(".localhost")
    ? hostname.split(".localhost")[0]
    : hostname.split(".")[0];

  // Encontra o team ativo pelo subdomain da URL
  const activeTeam = React.useMemo(() => {
    return teams.find((team) => team.subdomain === currentSubdomain) || teams[0];
  }, [teams, currentSubdomain]);

  // Obter nome do plano da subscription
  const planName = subscription?.planId
    ? PLAN_NAMES[subscription.planId] || subscription.planId
    : "Carregando...";

  // Estado vazio: sem organizações
  if (teams.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-gray-300 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Plus className="size-4" />
                </div>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-semibold">Adicionar organização</span>
                  <span className="truncate text-xs text-muted-foreground">Nenhuma organização</span>
                </div>
                <ChevronsUpDown className="ms-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Gerenciar organizações
              </DropdownMenuLabel>
              <DropdownMenuItem asChild className="gap-2 p-2">
                <Link to="/dashboard/tenants/create">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium">Criar organização</div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 p-2" onClick={() => setIsJoinModalOpen(true)}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Users className="size-4" />
                </div>
                <div className="font-medium">Juntar-se a organização</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
        <JoinTenantDialog isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
      </SidebarMenu>
    );
  }

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">{activeTeam.name}</span>
                {!subscriptionLoading && (
                  <span className="truncate text-xs text-muted-foreground">{planName}</span>
                )}
              </div>
              <ChevronsUpDown className="ms-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t("sidebar.companies")}
            </DropdownMenuLabel>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.id || team.name}
                onClick={() => {
                  // Redireciona para o subdomain do tenant selecionado
                  if (team.subdomain) {
                    const currentPath =
                      window.location.pathname + window.location.search + window.location.hash;
                    const subdomainUrl = getTenantSubdomainUrl(team.subdomain, currentPath);
                    window.location.href = subdomainUrl;
                  }
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                <span className="truncate">{team.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Gerenciar organizações
            </DropdownMenuLabel>
            <DropdownMenuItem asChild className="gap-2 p-2">
              <Link to="/dashboard/tenants/create">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium">Criar organização</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 p-2" onClick={() => setIsJoinModalOpen(true)}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Users className="size-4" />
              </div>
              <div className="font-medium">Juntar-se a organização</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <JoinTenantDialog isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </SidebarMenu>
  );
}
