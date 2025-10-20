import { AlertCircle, ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePlansQuery } from "@/api/queries/plan";
import type { PreviewPlanChangeResponse } from "@/api/schemas/subscription.schema";
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

interface PlanChangePreviewDialogProps {
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
 * Dialog que mostra preview da mudança de plano
 * Exibe informações sobre proration, valores e diferenças
 */
export function PlanChangePreviewDialog({
  open,
  onOpenChange,
  preview,
  isLoading,
  onConfirm,
  isConfirming,
}: PlanChangePreviewDialogProps) {
  const { t } = useTranslation("settings-plans");
  const { data: plans = [] } = usePlansQuery();

  if (isLoading) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("preview.calculating")}
            </AlertDialogTitle>
            <AlertDialogDescription>{t("preview.pleaseWait")}</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (!preview) return null;

  const { currentPlan, newPlan, billing, isUpgrade, isDowngrade } = preview;

  // Busca os nomes traduzidos dos planos
  const currentPlanData = plans.find((p) => p.id === currentPlan.id);
  const newPlanData = plans.find((p) => p.id === newPlan.id);

  const currentPlanName = currentPlanData
    ? t(`planNames.${getPlanKey(currentPlan.id)}`)
    : currentPlan.id;
  const newPlanName = newPlanData ? t(`planNames.${getPlanKey(newPlan.id)}`) : newPlan.id;

  // Fallback para calcular upgrade/downgrade se backend não enviar
  const calculatedIsUpgrade = isUpgrade ?? newPlan.price > currentPlan.price;
  const calculatedIsDowngrade = isDowngrade ?? newPlan.price < currentPlan.price;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {calculatedIsUpgrade && <ArrowUp className="w-5 h-5 text-green-600" />}
            {calculatedIsDowngrade && <ArrowDown className="w-5 h-5 text-orange-600" />}
            {t("preview.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>{t("preview.description")}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Plan Change Summary */}
          <div className="flex items-center justify-center gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{t("preview.currentPlan")}</p>
              <p className="font-semibold text-muted-foreground">{currentPlanName}</p>
            </div>

            <div className="flex-shrink-0">
              {calculatedIsUpgrade && <ArrowUp className="w-6 h-6 text-green-600" />}
              {calculatedIsDowngrade && <ArrowDown className="w-6 h-6 text-orange-600" />}
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{t("preview.newPlan")}</p>
              <p className="font-semibold text-primary">{newPlanName}</p>
            </div>
          </div>

          {/* Billing Details */}
          {!billing ? (
            <div className="rounded-lg border border-destructive p-4 bg-destructive/10">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Erro ao calcular cobrança</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    O servidor não retornou informações de cobrança. Tente novamente.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border p-4 space-y-3">
              <h4 className="font-semibold text-sm">{t("preview.billingDetails")}</h4>

              {/* Immediate Charge */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("preview.immediateCharge")}</span>
                <span
                  className={`font-semibold ${billing.immediateChargeAmount > 0 ? "text-primary" : "text-green-600"}`}
                >
                  {billing.immediateChargeAmount > 0
                    ? formatPrice(billing.immediateChargeAmount, "eur")
                    : t("preview.noCharge")}
                </span>
              </div>

              {billing.immediateChargeAmount > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("preview.chargeDate")}</span>
                  <span>{new Date(billing.immediateChargeDate).toLocaleDateString()}</span>
                </div>
              )}

              <div className="h-px bg-border" />

              {/* Next Billing */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("preview.nextBillingDate")}</span>
                <span className="font-medium">
                  {new Date(billing.nextBillingDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">{t("preview.nextBillingAmount")}</span>
                <span className="font-bold text-lg">
                  {formatPrice(billing.nextBillingAmount, "eur")}
                </span>
              </div>

              {/* Info message based on upgrade/downgrade */}
              {calculatedIsUpgrade && billing.immediateChargeAmount > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-blue-50 text-xs text-blue-900">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <p>{t("preview.upgradeInfo")}</p>
                </div>
              )}

              {calculatedIsDowngrade && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-orange-50 text-xs text-orange-900">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-600" />
                  <p>{t("preview.downgradeInfo")}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConfirming}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("loading")}
              </>
            ) : (
              t("preview.confirm")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
