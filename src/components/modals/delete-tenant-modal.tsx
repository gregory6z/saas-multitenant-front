import * as React from "react";
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

interface DeleteTenantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantName: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteTenantModal({
  open,
  onOpenChange,
  tenantName,
  onConfirm,
  isDeleting = false,
}: DeleteTenantModalProps) {
  const [confirmText, setConfirmText] = React.useState("");

  // Reset input when modal closes
  React.useEffect(() => {
    if (!open) {
      setConfirmText("");
    }
  }, [open]);

  // Check if user typed the tenant name correctly
  const isConfirmationValid = confirmText === tenantName;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Excluir Organização</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-2">
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-900">
                Esta ação não pode ser desfeita. Todos os dados da organização{" "}
                <span className="font-semibold">"{tenantName}"</span> serão permanentemente
                excluídos.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Os seguintes dados serão perdidos:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>Todos os chatbots e suas configurações</li>
                <li>Bases de conhecimento e documentos</li>
                <li>Convites e membros da equipe</li>
                <li>Sua assinatura e plano contratado</li>
                <li>Histórico de uso e dados de consumo</li>
                <li>Limites de recursos e configurações</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="confirm-name" className="text-sm">
                Para confirmar, digite o nome da organização:{" "}
                <span className="font-semibold">{tenantName}</span>
              </Label>
              <Input
                id="confirm-name"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`Digite "${tenantName}" para confirmar`}
                disabled={isDeleting}
                autoComplete="off"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              if (isConfirmationValid && !isDeleting) {
                onConfirm();
              }
            }}
            disabled={!isConfirmationValid || isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Excluindo..." : "Excluir Organização"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
