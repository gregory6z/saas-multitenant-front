import { Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRemoveMemberMutation } from "@/api/queries/member";
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
  const { t } = useTranslation("settings-members");

  // ✅ Usa novo hook da API
  const removeMember = useRemoveMemberMutation();

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
            {t("modals.remove.title", { name: memberName })}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-5 pt-2">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-900 leading-relaxed">
                {t("modals.remove.description")}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Email:</span> {memberEmail}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel disabled={removeMember.isPending}>
            <X className="w-4 h-4" />
            {t("modals.remove.cancelButton")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              if (!removeMember.isPending) {
                handleRemove();
              }
            }}
            loading={removeMember.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            <Trash2 className="w-4 h-4" />
            {removeMember.isPending
              ? t("modals.remove.removing")
              : t("modals.remove.confirmButton")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
