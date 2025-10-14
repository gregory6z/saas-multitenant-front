import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InviteMembersCard } from "@/components/members/invite-members-card";
import { MembersSkeleton } from "@/components/members/members-skeleton";
import { PendingInvitationsList } from "@/components/members/pending-invitations-list";
import { TeamMembersList } from "@/components/members/team-members-list";
import { RemoveMemberModal } from "@/components/modals/remove-member-modal";
import { useInvitations } from "@/hooks/use-invitations";
import { useCurrentUserRole, useTeamMembers } from "@/hooks/use-team-members";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/settings/members")({
  component: MembersPage,
});

function MembersPage() {
  const { t } = useTranslation("settings");
  const navigate = useNavigate();
  const [memberToRemove, setMemberToRemove] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  // Fetch data
  const { data: members, isLoading: membersLoading } = useTeamMembers();
  const { data: invitations } = useInvitations();
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
        <h1 className="text-2xl font-semibold text-foreground">{t("members.title")}</h1>
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
          memberName={memberToRemove.name}
          memberEmail={memberToRemove.email}
        />
      )}
    </div>
  );
}
