import { Mail, RotateCw, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useResendInvitationMutation, useRevokeInvitationMutation } from "@/api/queries/member";
import type { Invitation } from "@/api/schemas/member.schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PendingInvitationsListProps {
  invitations: Invitation[];
}

export function PendingInvitationsList({ invitations }: PendingInvitationsListProps) {
  const { t } = useTranslation("settings-members");

  // ✅ Usa novos hooks da API
  const resendInvitation = useResendInvitationMutation();
  const revokeInvitation = useRevokeInvitationMutation();

  const pendingInvitations = invitations.filter((inv) => inv.status === "pending");

  const handleResendInvitation = (id: string) => {
    resendInvitation.mutate(id);
  };

  const handleRevokeInvitation = (id: string) => {
    revokeInvitation.mutate(id);
  };

  const getRoleLabel = (role: string) => {
    return t(`roles.${role}` as const);
  };

  const getStatusLabel = (status: string) => {
    return status === "pending" ? t("modals.invite.sending") : status;
  };

  if (pendingInvitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Convites Pendentes ({pendingInvitations.length})
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
                  Função: {getRoleLabel(invitation.role)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{getStatusLabel(invitation.status)}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResendInvitation(invitation.id)}
                  disabled={resendInvitation.isPending}
                  title="Reenviar convite"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevokeInvitation(invitation.id)}
                  disabled={revokeInvitation.isPending}
                  title="Revogar convite"
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
