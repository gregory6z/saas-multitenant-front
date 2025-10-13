import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, RotateCw, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { MemberActionsDropdown } from "@/components/members/member-actions-dropdown";
import { MembersListSkeleton, MembersSkeleton } from "@/components/members/members-skeleton";
import { RemoveMemberModal } from "@/components/modals/remove-member-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const emailSchema = z.string().email({ message: "Email inválido" });

function MembersPage() {
  const { t } = useTranslation("settings");
  const navigate = useNavigate();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "curator" | "user">("user");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  // Fetch data
  const { data: members, isLoading: membersLoading } = useTeamMembers();
  const { data: invitations } = useInvitations();
  const { canManageTeam, role: currentUserRole, isLoading: roleLoading } = useCurrentUserRole();

  // Mutations
  const createInvitation = useCreateInvitation();
  const resendInvitation = useResendInvitation();
  const revokeInvitation = useRevokeInvitation();
  const updateMemberRole = useUpdateMemberRole();

  const handleResendInvitation = (id: string) => {
    resendInvitation.mutate(id, {
      onSuccess: () => toast.success(t("members.resendSuccess")),
      onError: () => toast.error(t("members.resendError")),
    });
  };

  const handleRevokeInvitation = (id: string) => {
    revokeInvitation.mutate(id, {
      onSuccess: () => toast.success(t("members.revokeSuccess")),
      onError: () => toast.error(t("members.revokeError")),
    });
  };

  const handleUpdateRole = (data: { userId: string; role: "admin" | "curator" | "user" }) => {
    updateMemberRole.mutate(data, {
      onSuccess: () => toast.success(t("members.updateRoleSuccess")),
      onError: () => toast.error(t("members.updateRoleError")),
    });
  };

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (!roleLoading && !canManageTeam) {
      navigate({ to: "/dashboard/chatbots" });
    }
  }, [canManageTeam, roleLoading, navigate]);

  const handleSendInvite = () => {
    const validation = emailSchema.safeParse(inviteEmail);

    if (!validation.success) {
      setEmailError(t("members.invalidEmail"));
      return;
    }

    setEmailError(null);
    createInvitation.mutate(
      { email: inviteEmail, role: inviteRole },
      {
        onSuccess: () => {
          setInviteEmail("");
          setInviteRole("user");
          setEmailError(null);
          toast.success(t("members.inviteSuccess"));
        },
        onError: () => {
          toast.error(t("members.inviteError"));
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
    return t(`members.roles.${role}` as `members.roles.${string}`);
  };

  const getStatusLabel = (status: string) => {
    return t(`members.invitationStatus.${status}` as `members.invitationStatus.${string}`);
  };

  // Show loading state while checking permissions
  if (roleLoading) {
    return <MembersSkeleton />;
  }

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
              <div className="flex-1 space-y-1">
                <Input
                  placeholder={t("members.enterEmail")}
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setEmailError(null);
                  }}
                  disabled={createInvitation.isPending}
                  aria-invalid={!!emailError}
                />
                {emailError && (
                  <p className="text-sm text-destructive">{emailError}</p>
                )}
              </div>
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
      {canManageTeam && invitations && invitations.filter((inv) => inv.status === "pending").length > 0 && (
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
                    className="flex items-center justify-between p-3 border rounded-xl"
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
                        onClick={() => handleResendInvitation(invitation.id)}
                        disabled={resendInvitation.isPending}
                        title={t("members.resendInvitation")}
                      >
                        <RotateCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeInvitation(invitation.id)}
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
                    {/* Only show actions for owners/admins */}
                    {canManageTeam && (
                      <MemberActionsDropdown
                        member={member}
                        currentUserRole={currentUserRole}
                        onUpdateRole={handleUpdateRole}
                        onRemove={setMemberToRemove}
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
