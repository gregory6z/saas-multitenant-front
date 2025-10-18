import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInvitationsQuery, useMembersQuery } from "@/api/queries/member";
import type { Member } from "@/api/schemas/member.schema";
import { RemoveMemberModal } from "@/components/features/settings/members/dialogs/remove-member-modal";
import { InviteMembersCard } from "@/components/features/settings/members/invite-members-card";
import { MembersSkeleton } from "@/components/features/settings/members/members-skeleton";
import { PendingInvitationsList } from "@/components/features/settings/members/pending-invitations-list";
import { TeamMembersList } from "@/components/features/settings/members/team-members-list";
import { useCurrentUserRole } from "@/hooks/use-team-members";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/settings/members")({
  component: MembersPage,
});

function MembersPage() {
  const { t } = useTranslation("settings-members");
  const navigate = useNavigate();
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

  // ✅ Usa novos hooks da API
  const { data: members, isLoading: membersLoading } = useMembersQuery();
  const { data: invitations } = useInvitationsQuery();
  const { canManageTeam, role: currentUserRole, isLoading: roleLoading } = useCurrentUserRole();

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (!roleLoading && !canManageTeam) {
      navigate({ to: "/dashboard/chatbots" });
    }
  }, [canManageTeam, roleLoading, navigate]);

  // Show loading state while checking permissions
  if (roleLoading) {
    return <MembersSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8 px-4 md:px-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      </div>

      {/* Invite Members - Only visible for owners/admins */}
      {canManageTeam && <InviteMembersCard />}

      {/* Pending Invitations */}
      {canManageTeam && invitations && <PendingInvitationsList invitations={invitations} />}

      {/* Team Members */}
      <TeamMembersList
        members={members}
        isLoading={membersLoading}
        canManageTeam={canManageTeam}
        currentUserRole={currentUserRole}
        onRemoveMember={setMemberToRemove}
      />

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
          memberName={memberToRemove.name || memberToRemove.email}
          memberEmail={memberToRemove.email}
        />
      )}
    </div>
  );
}
