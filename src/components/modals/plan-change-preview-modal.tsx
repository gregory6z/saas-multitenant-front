import { AlertCircle, ArrowDown, ArrowUp, Loader2 } from "lucide-react";
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
import { formatPrice, usePlans } from "@/hooks/use-plans";
import type { PreviewPlanChangeResponse } from "@/hooks/use-subscription";

interface PlanChangePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preview: PreviewPlanChangeResponse | null;
  isLoading: boolean;
  onConfirm: () => void;
  isConfirming: boolean;
}

/**
 * Extrai chave do plano para tradução
 */
function getPlanKey(planId: string): string {
  return planId.replace("plan-", "").replace("-annual", "").replace("-monthly", "");
}

/**
 * Modal que mostra preview da mudança de plano
 * Exibe informações sobre proration, valores e diferenças
 */
export function PlanChangePreviewModal({
  open,
  onOpenChange,
  preview,
  isLoading,
  onConfirm,
  isConfirming,
}: PlanChangePreviewModalProps) {
  const { t } = useTranslation("common");
  const { plans } = usePlans();

  if (isLoading) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("plans.preview.calculating")}
            </AlertDialogTitle>
            <AlertDialogDescription>{t("plans.preview.pleaseWait")}</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (!preview) return null;

  const { currentPlan, newPlan, proration } = preview;

  // Busca os nomes traduzidos dos planos
  const currentPlanData = plans.find((p) => p.id === currentPlan.id);
  const newPlanData = plans.find((p) => p.id === newPlan.id);

  const currentPlanName = currentPlanData
    ? t(`plans.planNames.${getPlanKey(currentPlan.id)}`)
    : currentPlan.id;
  const newPlanName = newPlanData ? t(`plans.planNames.${getPlanKey(newPlan.id)}`) : newPlan.id;

  // Calcula se é upgrade ou downgrade baseado no preço
  const isUpgrade = newPlan.price > currentPlan.price;
  const isDowngrade = newPlan.price < currentPlan.price;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isUpgrade && <ArrowUp className="w-5 h-5 text-green-600" />}
            {isDowngrade && <ArrowDown className="w-5 h-5 text-orange-600" />}
            {t("plans.preview.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>{t("plans.preview.description")}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Plan */}
          <div className="rounded-lg border p-3 bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">{t("plans.preview.currentPlan")}</p>
            <p className="font-semibold">{currentPlanName}</p>
            <p className="text-sm text-muted-foreground">
              {formatPrice(currentPlan.price, "eur")}
              {currentPlan.interval === "month" ? t("plans.perMonth") : t("plans.perYear")}
            </p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            {isUpgrade && <ArrowUp className="w-6 h-6 text-green-600" />}
            {isDowngrade && <ArrowDown className="w-6 h-6 text-orange-600" />}
          </div>

          {/* New Plan */}
          <div className="rounded-lg border p-3 bg-primary/5">
            <p className="text-xs text-muted-foreground mb-1">{t("plans.preview.newPlan")}</p>
            <p className="font-semibold">{newPlanName}</p>
            <p className="text-sm text-muted-foreground">
              {formatPrice(newPlan.price, "eur")}
              {newPlan.interval === "month" ? t("plans.perMonth") : t("plans.perYear")}
            </p>
          </div>

          {/* Proration Details */}
          <div className="rounded-lg border p-4 space-y-3">
            <h4 className="font-semibold text-sm">{t("plans.preview.prorationDetails")}</h4>

            {proration.creditAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("plans.preview.creditAmount")}</span>
                <span className="text-green-600 font-medium">
                  {formatPrice(proration.creditAmount, "eur")}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("plans.preview.amountDue")}</span>
              <span className="font-semibold">{formatPrice(proration.amountDue, "eur")}</span>
            </div>

            <div className="h-px bg-border" />

            <div className="flex justify-between">
              <span className="font-semibold">{t("plans.preview.nextInvoice")}</span>
              <span className="font-bold text-lg">{formatPrice(proration.nextInvoiceAmount, "eur")}</span>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50 text-xs text-muted-foreground">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                {t("plans.preview.proratedInfo", {
                  date: new Date(proration.proratedUntil).toLocaleDateString(),
                })}
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConfirming}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("status.processing")}
              </>
            ) : (
              t("plans.preview.confirm")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
