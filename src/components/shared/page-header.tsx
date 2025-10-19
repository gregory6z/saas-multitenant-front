import { Link } from "@tanstack/react-router";
import { ChevronsUpDown } from "lucide-react";
import { BreadcrumbNavigation } from "@/components/navigation/breadcrumb-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useUser } from "@/hooks/use-users";

export function PageHeader() {
  const { logout } = useAuth();
  const { data: user } = useUser();

  // User data with fallback
  const userData = user ?? {
    name: "Usuário",
    email: "usuario@exemplo.com",
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 px-3">
      <SidebarTrigger className="-ml-1" />
      <BreadcrumbNavigation />

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-accent transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={userData.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground text-xs">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userData.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/dashboard/settings/general">Configurações</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/settings/billing">Planos e Faturamento</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logout.mutate()}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
