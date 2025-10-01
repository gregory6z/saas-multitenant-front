import { Link } from "@tanstack/react-router";
import { Bot, Building2, LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useTenants } from "@/hooks/use-tenants";
import { useUser } from "@/hooks/use-users";
import { useSubdomain } from "@/hooks/use-subdomain";
import { CompanySwitcher } from "@/components/navigation/company-switcher";

export function DashboardHeader() {
  const { logout } = useAuth();
  const { tenants, isLoading: tenantsLoading, error: tenantsError } = useTenants();
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const { data: currentTenant } = useSubdomain();

  // Transform tenants data to teams format for CompanySwitcher
  // Prioritize current tenant and mark it as selected
  const teams =
    tenants?.map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
      logo: Building2,
      plan: tenant.status === "active" ? "Active" : "Inactive",
      subdomain: tenant.subdomain,
      isCurrent: currentTenant?.id === tenant.id,
    })) ?? [];

  // Use real user data or fallback to default
  const userData = user ?? {
    name: "Usuário",
    email: "usuario@exemplo.com",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <header className="bg-card border-b border-border px-4 py-2">
      <div className="flex items-center justify-between h-[44px]">
        {/* Left side - Logo + Company Switcher + Breadcrumb */}
        <div className="flex items-center gap-4">
          {/* RagBoost Logo */}
          <Link to="/dashboard" className="flex items-center justify-center">
            <Bot className="w-8 h-8 text-primary hover:text-primary/80 transition-colors" />
          </Link>
          
          {/* Separator */}
          <div className="w-px h-6 bg-border"></div>
          {tenantsLoading ? (
            <Skeleton className="h-10 w-64" />
          ) : tenantsError ? (
            <div className="text-sm text-red-600">Error loading tenants</div>
          ) : (
            <CompanySwitcher teams={teams} />
          )}
          {/* <BreadcrumbNavigation /> */}
        </div>

        {/* Right side - User Menu */}
        <div className="flex items-center gap-3">
          {userLoading ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          ) : userError ? (
            <div className="text-sm text-red-600">Error loading user</div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-3 hover:bg-accent/50 rounded-lg p-1 transition-colors"
                >
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{userData.name}</div>
                    <div className="text-xs text-muted-foreground">{userData.email}</div>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="" alt={userData.name} />
                    <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs">
                      {getInitials(userData.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/_layout/settings/general" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
