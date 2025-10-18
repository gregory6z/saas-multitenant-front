import { MoreHorizontal, Shield, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Member } from "@/api/schemas/member.schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemberActionsDropdownProps {
  member: Member;
  currentUserRole: string | null;
  onUpdateRole: (data: { userId: string; role: "admin" | "curator" | "user" }) => void;
  onRemove: (member: Member) => void;
  isUpdating?: boolean;
}

export function MemberActionsDropdown({
  member,
  currentUserRole,
  onUpdateRole,
  onRemove,
  isUpdating = false,
}: MemberActionsDropdownProps) {
  const { t } = useTranslation("settings-members");

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
        <DropdownMenuLabel>{t("actions.changeRole")}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Change Role - Only for owners, or admins managing non-admins */}
        {canChangeRole && (
          <>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              {t("actions.changeRole")}
            </DropdownMenuLabel>

            {/* Promote to Admin */}
            {member.role !== "admin" && (
              <DropdownMenuItem onClick={() => handleUpdateRole("admin")} disabled={isUpdating}>
                <Shield className="w-4 h-4" />
                {t("actions.promoteToAdmin")}
              </DropdownMenuItem>
            )}

            {/* Demote Admin to Curator (Owner only) */}
            {currentUserRole === "owner" && member.role === "admin" && (
              <DropdownMenuItem onClick={() => handleUpdateRole("curator")} disabled={isUpdating}>
                <Shield className="w-4 h-4" />
                {t("actions.demoteToCurator")}
              </DropdownMenuItem>
            )}

            {/* Change to Curator (Owner only) */}
            {currentUserRole === "owner" &&
              member.role !== "curator" &&
              member.role !== "admin" && (
                <DropdownMenuItem onClick={() => handleUpdateRole("curator")} disabled={isUpdating}>
                  <Shield className="w-4 h-4" />
                  {t("actions.changeToCurator")}
                </DropdownMenuItem>
              )}

            {/* Change to User (Owner only) */}
            {currentUserRole === "owner" && member.role !== "user" && (
              <DropdownMenuItem onClick={() => handleUpdateRole("user")} disabled={isUpdating}>
                <Shield className="w-4 h-4" />
                {t("actions.changeToUser")}
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
          </>
        )}

        {/* Remove Member */}
        <DropdownMenuItem
          onClick={() => onRemove(member)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
          {t("actions.remove")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
