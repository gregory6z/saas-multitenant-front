import { Link } from "@tanstack/react-router";
import { ChevronsUpDown, Plus, Users } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { JoinTenantModal } from "@/components/modals/join-tenant-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTenantSubdomainUrl } from "@/lib/url-utils";

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
  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false);

  // Detecta tenant ativo baseado no subdomain da URL atual
  const hostname = window.location.hostname;
  const currentSubdomain = hostname.includes(".localhost")
    ? hostname.split(".localhost")[0]
    : hostname.split(".")[0];

  // Encontra o team ativo pelo subdomain da URL
  const activeTeam = React.useMemo(() => {
    return teams.find((team) => team.subdomain === currentSubdomain) || teams[0];
  }, [teams, currentSubdomain]);

  // Estado vazio: sem organizações
  if (teams.length === 0) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
          disabled
        >
          <div className="bg-gray-300 text-white flex aspect-square size-6 items-center justify-center rounded-md">
            <Plus className="size-3" />
          </div>
          <div className="font-medium text-muted-foreground text-base">
            Adicionar organização
          </div>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-50">
              <ChevronsUpDown className="size-4" />
              <span className="sr-only">Gerenciar organizações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[16rem] rounded-lg" align="start" sideOffset={4}>
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Gerenciar organizações
            </DropdownMenuLabel>
            <DropdownMenuItem asChild className="gap-2 p-2">
              <Link to="/dashboard/tenants/create">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium">Criar organização</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 p-2" onClick={() => setIsJoinModalOpen(true)}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Users className="size-4" />
              </div>
              <div className="font-medium">Juntar-se a organização</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <JoinTenantModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
      </div>
    );
  }

  if (!activeTeam) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      {/* Company Info - Clickable as breadcrumb */}
      <button
        type="button"
        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
        onClick={() => {
          // TODO: Navigate to company dashboard/overview
          console.log("Navigate to company dashboard:", activeTeam.name);
        }}
      >
        <div className="bg-blue-500 text-white flex aspect-square size-6 items-center justify-center rounded-md">
          <activeTeam.logo className="size-3" />
        </div>
        <div className="flex items-center gap-2">
          <div className="font-medium text-foreground text-base max-w-[180px] truncate">
            {activeTeam.name}
          </div>
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {activeTeam.plan}
          </span>
        </div>
      </button>

      {/* Dropdown Trigger - Only the chevron */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-50">
            <ChevronsUpDown className="size-4" />
            <span className="sr-only">Trocar organização</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[16rem] rounded-lg" align="start" sideOffset={4}>
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
                <team.logo className="size-3.5 shrink-0" />
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
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium">Criar organização</div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 p-2" onClick={() => setIsJoinModalOpen(true)}>
            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
              <Users className="size-4" />
            </div>
            <div className="font-medium">Juntar-se a organização</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Join Tenant Modal */}
      <JoinTenantModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </div>
  );
}
