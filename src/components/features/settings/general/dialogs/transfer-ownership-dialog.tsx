import { AlertTriangle, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTransferOwnershipMutation } from "@/api/queries/member";
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

interface TransferOwnershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newOwnerId: string;
  newOwnerName: string;
}

export function TransferOwnershipDialog({
  open,
  onOpenChange,
  newOwnerId,
  newOwnerName,
}: TransferOwnershipDialogProps) {
  const { t } = useTranslation("settings-general");

  // ✅ Hook da API chamado diretamente no dialog
  const transferMutation = useTransferOwnershipMutation();

  const handleConfirm = () => {
    transferMutation.mutate(
      { newOwnerId },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>{t("modals.transferOwnership.confirmTitle")}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p>{t("modals.transferOwnership.confirmDescription", { name: newOwnerName })}</p>
            <p className="font-semibold text-destructive">
              {t("modals.transferOwnership.confirmWarning")}
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>{t("modals.transferOwnership.consequence1", { name: newOwnerName })}</li>
              <li>{t("modals.transferOwnership.consequence2")}</li>
              <li>{t("modals.transferOwnership.consequence3")}</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={transferMutation.isPending}>
            <X className="w-4 h-4" />
            {t("modals.transferOwnership.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            loading={transferMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            <Check className="w-4 h-4" />
            {transferMutation.isPending
              ? t("modals.transferOwnership.transferring")
              : t("modals.transferOwnership.confirmButton")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
