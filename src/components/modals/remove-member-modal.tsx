import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRemoveMember } from "@/hooks/use-team-members";

interface RemoveMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  memberName: string;
  memberEmail: string;
}

export function RemoveMemberModal({
  open,
  onOpenChange,
  memberId,
  memberName,
  memberEmail,
}: RemoveMemberModalProps) {
  const { t } = useTranslation("settings");
  const removeMember = useRemoveMember();

  const handleRemove = () => {
    removeMember.mutate(memberId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="text-xl">
            {t("members.removeMemberModal.title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-5 pt-2">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-900 leading-relaxed">
                {t("members.removeMemberModal.confirmationQuestion")}{" "}
                <span className="font-semibold">{memberName}</span>{" "}
                {t("members.removeMemberModal.fromTeam")}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {t("members.removeMemberModal.email")}
                </span>{" "}
                {memberEmail}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("members.removeMemberModal.consequences")}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel disabled={removeMember.isPending}>
            {t("members.removeMemberModal.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              if (!removeMember.isPending) {
                handleRemove();
              }
            }}
            disabled={removeMember.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {removeMember.isPending
              ? t("members.removeMemberModal.removing")
              : t("members.removeMemberModal.remove")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
