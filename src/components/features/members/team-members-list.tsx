import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useChangeMemberRoleMutation } from "@/api/queries/member/use-change-role-mutation";
import type { Member } from "@/api/schemas/member.schema";
import { MemberActionsDropdown } from "@/components/features/members/member-actions-dropdown";
import { MembersListSkeleton } from "@/components/features/members/members-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamMembersListProps {
  members: Member[] | undefined;
  isLoading: boolean;
  canManageTeam: boolean;
  currentUserRole: string | null;
  onRemoveMember: (member: Member) => void;
}

export function TeamMembersList({
  members,
  isLoading,
  canManageTeam,
  currentUserRole,
  onRemoveMember,
}: TeamMembersListProps) {
  const { t } = useTranslation("settings-members");

  // ✅ Usa hook do Model diretamente
  const updateMemberRole = useChangeMemberRoleMutation();

  const handleUpdateRole = (data: { userId: string; role: "admin" | "curator" | "user" }) => {
    updateMemberRole.mutate(data, {
      onSuccess: () => toast.success(t("modals.changeRole.success")),
      onError: () => toast.error(t("modals.changeRole.error")),
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === "owner") return "default";
    if (role === "admin") return "secondary";
    return "outline";
  };

  const getRoleLabel = (role: string) => {
    return t(`roles.${role}` as const);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {t("title")} ({members?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <MembersListSkeleton />
        ) : !members || members.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">{t("empty.title")}</p>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" alt={member.name || member.email} />
                    <AvatarFallback className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
                      {(member.name || member.email)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name || member.email}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {getRoleLabel(member.role)}
                  </Badge>
                  {canManageTeam && (
                    <MemberActionsDropdown
                      member={member}
                      currentUserRole={currentUserRole}
                      onUpdateRole={handleUpdateRole}
                      onRemove={onRemoveMember}
                      isUpdating={updateMemberRole.isPending}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
