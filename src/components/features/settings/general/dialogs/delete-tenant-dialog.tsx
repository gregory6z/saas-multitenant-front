import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDeleteTenantMutation } from "@/api/queries/tenant";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantName: string;
}

export function DeleteTenantDialog({ open, onOpenChange, tenantName }: DeleteTenantDialogProps) {
  const { t } = useTranslation("settings-general");
  const [confirmText, setConfirmText] = React.useState("");

  // ✅ Hook da API chamado diretamente no dialog
  const deleteMutation = useDeleteTenantMutation();

  // Reset input when modal closes
  React.useEffect(() => {
    if (!open) {
      setConfirmText("");
    }
  }, [open]);

  // Check if user typed the tenant name correctly
  const isConfirmationValid = confirmText === tenantName;

  const handleConfirm = () => {
    if (isConfirmationValid && !deleteMutation.isPending) {
      deleteMutation.mutate();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">{t("modals.deleteTenant.title")}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-2">
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-900">
                {t("modals.deleteTenant.warningMessage", { tenantName })}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                {t("modals.deleteTenant.dataWillBeLost")}
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>{t("modals.deleteTenant.data.chatbots")}</li>
                <li>{t("modals.deleteTenant.data.knowledgeBase")}</li>
                <li>{t("modals.deleteTenant.data.invites")}</li>
                <li>{t("modals.deleteTenant.data.subscription")}</li>
                <li>{t("modals.deleteTenant.data.usage")}</li>
                <li>{t("modals.deleteTenant.data.limits")}</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="confirm-name" className="text-sm">
                {t("modals.deleteTenant.confirmLabel", { tenantName })}
              </Label>
              <Input
                id="confirm-name"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={t("modals.deleteTenant.confirmPlaceholder", { tenantName })}
                disabled={deleteMutation.isPending}
                autoComplete="off"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            {t("modals.deleteTenant.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={!isConfirmationValid || deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleteMutation.isPending
              ? t("modals.deleteTenant.deleting")
              : t("modals.deleteTenant.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
