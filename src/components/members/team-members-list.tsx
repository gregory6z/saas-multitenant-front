import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MemberActionsDropdown } from "@/components/members/member-actions-dropdown";
import { MembersListSkeleton } from "@/components/members/members-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TeamMember, useUpdateMemberRole } from "@/hooks/use-team-members";

interface TeamMembersListProps {
  members: TeamMember[] | undefined;
  isLoading: boolean;
  canManageTeam: boolean;
  currentUserRole: string | null;
  onRemoveMember: (member: { id: string; name: string; email: string }) => void;
}

export function TeamMembersList({
  members,
  isLoading,
  canManageTeam,
  currentUserRole,
  onRemoveMember,
}: TeamMembersListProps) {
  const { t } = useTranslation("settings");
  const updateMemberRole = useUpdateMemberRole();

  const handleUpdateRole = (data: { userId: string; role: "admin" | "curator" | "user" }) => {
    updateMemberRole.mutate(data, {
      onSuccess: () => toast.success(t("members.updateRoleSuccess")),
      onError: () => toast.error(t("members.updateRoleError")),
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === "owner") return "default";
    if (role === "admin") return "secondary";
    return "outline";
  };

  const getRoleLabel = (role: string) => {
    return t(`members.roles.${role}` as `members.roles.${string}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {t("members.teamMembers")} ({members?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <MembersListSkeleton />
        ) : !members || members.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">{t("members.noMembersFound")}</p>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
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
