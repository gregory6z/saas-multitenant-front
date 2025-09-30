import { ChevronsUpDown, Plus, Users } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JoinTenantModal } from "@/components/modals/join-tenant-modal";

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
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);
  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false);

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
          <div className="font-medium text-foreground text-base">{activeTeam.name}</div>
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {activeTeam.plan}
          </span>
        </div>
      </button>

      {/* Dropdown Trigger - Only the chevron */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-50"
          >
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
            onClick={() => setActiveTeam(team)}
            className="gap-2 p-2"
          >
            <div className="flex size-6 items-center justify-center rounded-md border">
              <team.logo className="size-3.5 shrink-0" />
            </div>
            {team.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Gerenciar organizações
        </DropdownMenuLabel>
        <DropdownMenuItem asChild className="gap-2 p-2">
          <Link to="/tenants/create">
            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
              <Plus className="size-4" />
            </div>
            <div className="font-medium">Criar organização</div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="gap-2 p-2"
          onClick={() => setIsJoinModalOpen(true)}
        >
          <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
            <Users className="size-4" />
          </div>
          <div className="font-medium">Juntar-se a organização</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>

      {/* Join Tenant Modal */}
      <JoinTenantModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
      />
    </div>
  );
}
