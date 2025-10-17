import { Mail, RotateCw, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResendInvitation, useRevokeInvitation } from "@/hooks/use-invitations";

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
}

interface PendingInvitationsListProps {
  invitations: Invitation[];
}

export function PendingInvitationsList({ invitations }: PendingInvitationsListProps) {
  const { t } = useTranslation("settings");
  const resendInvitation = useResendInvitation();
  const revokeInvitation = useRevokeInvitation();

  const pendingInvitations = invitations.filter((inv) => inv.status === "pending");

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

  const getRoleLabel = (role: string) => {
    return t(`members.roles.${role}` as `members.roles.${string}`);
  };

  const getStatusLabel = (status: string) => {
    return t(`members.invitationStatus.${status}` as `members.invitationStatus.${string}`);
  };

  if (pendingInvitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          {t("members.pendingInvitations")} ({pendingInvitations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingInvitations.map((invitation) => (
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
  );
}
