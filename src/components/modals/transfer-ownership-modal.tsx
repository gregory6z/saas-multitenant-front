import { AlertTriangle, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
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
import { useTenants } from "@/hooks/use-tenants";

interface TransferOwnershipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newOwnerId: string;
  newOwnerName: string;
}

export function TransferOwnershipModal({
  open,
  onOpenChange,
  newOwnerId,
  newOwnerName,
}: TransferOwnershipModalProps) {
  const { t } = useTranslation("settings");
  const { transferOwnership } = useTenants();

  const handleConfirm = () => {
    transferOwnership.mutate(
      { newOwnerId },
      {
        onSuccess: () => {
          toast.success(t("members.transferOwnership.successMessage", { name: newOwnerName }));
          onOpenChange(false);
        },
        onError: (error) => {
          const errorMessage =
            (error as Error & { response?: { data?: { message?: string } } }).response?.data
              ?.message || t("members.transferOwnership.errorMessage");
          toast.error(errorMessage);
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
            <AlertDialogTitle>{t("members.transferOwnership.confirmTitle")}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p>{t("members.transferOwnership.confirmDescription", { name: newOwnerName })}</p>
            <p className="font-semibold text-destructive">
              {t("members.transferOwnership.confirmWarning")}
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>{t("members.transferOwnership.consequence1", { name: newOwnerName })}</li>
              <li>{t("members.transferOwnership.consequence2")}</li>
              <li>{t("members.transferOwnership.consequence3")}</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={transferOwnership.isPending}>
            <X className="w-4 h-4" />
            {t("members.transferOwnership.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            loading={transferOwnership.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            <Check className="w-4 h-4" />
            {t("members.transferOwnership.confirmButton")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
