import { AlertCircle, Loader2, Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Addon } from "@/api/schemas/subscription.schema";
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

/**
 * Formats price from cents to currency string
 */
function formatPrice(priceInCents: number, currency: string): string {
  const price = priceInCents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(price);
}

interface AddonPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addon: Addon | null;
  action: "add" | "remove";
  onConfirm: () => void;
  isConfirming: boolean;
}

/**
 * Dialog que mostra preview antes de adicionar/remover addon
 * Exibe informações sobre proration (add) ou refund (remove)
 */
export function AddonPreviewDialog({
  open,
  onOpenChange,
  addon,
  action,
  onConfirm,
  isConfirming,
}: AddonPreviewDialogProps) {
  const { t } = useTranslation("settings-plans");

  if (!addon) return null;

  const isAdding = action === "add";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isAdding ? (
              <Plus className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-orange-600" />
            )}
            {isAdding ? t("addonPreview.addTitle") : t("addonPreview.removeTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isAdding ? t("addonPreview.addDescription") : t("addonPreview.removeDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Addon Info */}
          <div className="rounded-lg border p-4 bg-muted/30">
            <h4 className="font-semibold text-sm mb-2">{t("addonPreview.addonInfo")}</h4>
            <p className="font-semibold">{addon.name}</p>
            <p className="text-sm text-muted-foreground">{addon.description}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {formatPrice(addon.price, addon.currency)}
              {addon.interval === "month" ? t("perMonth") : t("perYear")}
            </p>
          </div>

          {/* Billing Info */}
          <div className="rounded-lg border p-4 space-y-3">
            <h4 className="font-semibold text-sm">{t("addonPreview.billingInfo")}</h4>

            {isAdding ? (
              <>
                <div className="flex items-start gap-2 p-3 rounded-md bg-blue-50 text-xs text-blue-900">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <p>{t("addonPreview.prorationInfo")}</p>
                </div>
                <p className="text-xs text-muted-foreground">{t("addonPreview.prorationNote")}</p>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2 p-3 rounded-md bg-orange-50 text-xs text-orange-900">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-600" />
                  <p>{t("addonPreview.removeInfo")}</p>
                </div>
                <p className="text-xs text-muted-foreground">{t("addonPreview.removeNote")}</p>
              </>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConfirming}>
            {t("addonPreview.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("loading")}
              </>
            ) : isAdding ? (
              t("addonPreview.confirmAdd")
            ) : (
              t("addonPreview.confirmRemove")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
