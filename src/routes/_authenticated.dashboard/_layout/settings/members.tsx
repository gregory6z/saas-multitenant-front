import { createFileRoute } from "@tanstack/react-router";
import { Mail, MoreHorizontal, RotateCw, Shield, Trash2, Users, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RemoveMemberModal } from "@/components/modals/remove-member-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateInvitation,
  useInvitations,
  useResendInvitation,
  useRevokeInvitation,
} from "@/hooks/use-invitations";
import { useCurrentUserRole, useTeamMembers, useUpdateMemberRole } from "@/hooks/use-team-members";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/settings/members")({
  component: MembersPage,
});

function MembersPage() {
  const { t } = useTranslation("settings");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "curator" | "user">("user");
  const [memberToRemove, setMemberToRemove] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  // Fetch data
  const { data: members, isLoading: membersLoading } = useTeamMembers();
  const { data: invitations } = useInvitations();
  const { canManageTeam, role: currentUserRole } = useCurrentUserRole();

  // Mutations
  const createInvitation = useCreateInvitation();
  const resendInvitation = useResendInvitation();
  const revokeInvitation = useRevokeInvitation();
  const updateMemberRole = useUpdateMemberRole();

  const handleSendInvite = () => {
    if (!inviteEmail || !inviteEmail.includes("@")) return;

    createInvitation.mutate(
      { email: inviteEmail, role: inviteRole },
      {
        onSuccess: () => {
          setInviteEmail("");
          setInviteRole("user"); // Reset to default
        },
      }
    );
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === "owner") return "default";
    if (role === "admin") return "secondary";
    return "outline";
  };

  const getRoleLabel = (role: string) => {
    return t(`members.roles.${role}` as any);
  };

  const getStatusLabel = (status: string) => {
    return t(`members.invitationStatus.${status}` as any);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8 px-4 md:px-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t("members.title")}</h1>
      </div>

      {/* Invite Members - Only visible for owners/admins */}
      {canManageTeam && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              {t("members.inviteNew")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t("members.enterEmail")}
                className="flex-1"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={createInvitation.isPending}
              />
              <Select
                value={inviteRole}
                onValueChange={(value) => setInviteRole(value as "admin" | "curator" | "user")}
                disabled={createInvitation.isPending}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("members.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t("members.roles.user")}</SelectItem>
                  <SelectItem value="curator">{t("members.roles.curator")}</SelectItem>
                  <SelectItem value="admin">{t("members.roles.admin")}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleSendInvite}
                disabled={createInvitation.isPending || !inviteEmail}
              >
                {createInvitation.isPending ? t("members.sending") : t("members.sendInvite")}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("members.invitedMembersWillReceive")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pending Invitations */}
      {canManageTeam && invitations && invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              {t("members.pendingInvitations")} ({invitations.filter((inv) => inv.status === "pending").length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations
                .filter((inv) => inv.status === "pending")
                .map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{invitation.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("members.role")}: {getRoleLabel(invitation.role)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getStatusLabel(invitation.status)}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resendInvitation.mutate(invitation.id)}
                        disabled={resendInvitation.isPending}
                        title={t("members.resendInvitation")}
                      >
                        <RotateCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => revokeInvitation.mutate(invitation.id)}
                        disabled={revokeInvitation.isPending}
                        title={t("members.revokeInvitation")}
                        className="hover:bg-red-50"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t("members.teamMembers")} ({members?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {membersLoading ? (
            <p className="text-center text-muted-foreground py-4">{t("members.loadingMembers")}</p>
          ) : !members || members.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">{t("members.noMembersFound")}</p>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
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
                    {/* Only show actions for owners/admins, but not for owner members */}
                    {canManageTeam && member.role !== "owner" && (
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t("members.memberActions")}</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {/* Change Role - Only for owners, or admins promoting to admin */}
                          {(currentUserRole === "owner" ||
                            (currentUserRole === "admin" && member.role !== "admin")) && (
                            <>
                              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                                {t("members.changeRole")}
                              </DropdownMenuLabel>
                              {member.role !== "admin" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateMemberRole.mutate({ userId: member.id, role: "admin" })
                                  }
                                  disabled={updateMemberRole.isPending}
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  {t("members.promoteToAdmin")}
                                </DropdownMenuItem>
                              )}
                              {currentUserRole === "owner" && member.role === "admin" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateMemberRole.mutate({ userId: member.id, role: "curator" })
                                  }
                                  disabled={updateMemberRole.isPending}
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  {t("members.demoteToCurator")}
                                </DropdownMenuItem>
                              )}
                              {currentUserRole === "owner" &&
                                member.role !== "curator" &&
                                member.role !== "admin" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateMemberRole.mutate({
                                        userId: member.id,
                                        role: "curator",
                                      })
                                    }
                                    disabled={updateMemberRole.isPending}
                                  >
                                    <Shield className="w-4 h-4 mr-2" />
                                    {t("members.changeToCurator")}
                                  </DropdownMenuItem>
                                )}
                              {currentUserRole === "owner" && member.role !== "user" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateMemberRole.mutate({ userId: member.id, role: "user" })
                                  }
                                  disabled={updateMemberRole.isPending}
                                >
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
                              setMemberToRemove({
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("members.rolePermissions")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">{t("members.roles.owner")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("members.roleDescriptions.owner")}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">{t("members.roles.admin")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("members.roleDescriptions.admin")}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">{t("members.roles.curator")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("members.roleDescriptions.curator")}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">{t("members.roles.user")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("members.roleDescriptions.user")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remove Member Modal */}
      {memberToRemove && (
        <RemoveMemberModal
          open={!!memberToRemove}
          onOpenChange={(open) => {
            if (!open) {
              setMemberToRemove(null);
            }
          }}
          memberId={memberToRemove.id}
          memberName={memberToRemove.name}
          memberEmail={memberToRemove.email}
        />
      )}
    </div>
  );
}
