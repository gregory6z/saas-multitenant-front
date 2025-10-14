import { MoreHorizontal, Shield, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TeamMember } from "@/hooks/use-team-members";

interface MemberActionsDropdownProps {
  member: TeamMember;
  currentUserRole: string | null;
  onUpdateRole: (data: { userId: string; role: "admin" | "curator" | "user" }) => void;
  onRemove: (member: { id: string; name: string; email: string }) => void;
  isUpdating?: boolean;
}

export function MemberActionsDropdown({
  member,
  currentUserRole,
  onUpdateRole,
  onRemove,
  isUpdating = false,
}: MemberActionsDropdownProps) {
  const { t } = useTranslation("settings");

  const handleUpdateRole = (role: "admin" | "curator" | "user") => {
    onUpdateRole({ userId: member.id, role });
  };

  // Don't show actions for owner members
  if (member.role === "owner") {
    return null;
  }

  const canChangeRole =
    currentUserRole === "owner" || (currentUserRole === "admin" && member.role !== "admin");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("members.memberActions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Change Role - Only for owners, or admins managing non-admins */}
        {canChangeRole && (
          <>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              {t("members.changeRole")}
            </DropdownMenuLabel>

            {/* Promote to Admin */}
            {member.role !== "admin" && (
              <DropdownMenuItem onClick={() => handleUpdateRole("admin")} disabled={isUpdating}>
                <Shield className="w-4 h-4 mr-2" />
                {t("members.promoteToAdmin")}
              </DropdownMenuItem>
            )}

            {/* Demote Admin to Curator (Owner only) */}
            {currentUserRole === "owner" && member.role === "admin" && (
              <DropdownMenuItem onClick={() => handleUpdateRole("curator")} disabled={isUpdating}>
                <Shield className="w-4 h-4 mr-2" />
                {t("members.demoteToCurator")}
              </DropdownMenuItem>
            )}

            {/* Change to Curator (Owner only) */}
            {currentUserRole === "owner" &&
              member.role !== "curator" &&
              member.role !== "admin" && (
                <DropdownMenuItem onClick={() => handleUpdateRole("curator")} disabled={isUpdating}>
                  <Shield className="w-4 h-4 mr-2" />
                  {t("members.changeToCurator")}
                </DropdownMenuItem>
              )}

            {/* Change to User (Owner only) */}
            {currentUserRole === "owner" && member.role !== "user" && (
              <DropdownMenuItem onClick={() => handleUpdateRole("user")} disabled={isUpdating}>
                <Shield className="w-4 h-4 mr-2" />
                {t("members.changeToUser")}
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
          </>
        )}

        {/* Remove Member */}
        <DropdownMenuItem
          onClick={() => {
            onRemove({
              id: member.id,
              name: member.name,
              email: member.email,
            });
          }}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t("members.removeMember")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
