import { ArrowUpCircle, Check, Zap } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { PlanChangePreviewModal } from "@/components/modals/plan-change-preview-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, type Plan } from "@/hooks/use-plans";
import {
  type PreviewPlanChangeResponse,
  useChangePlan,
  useCreateCheckoutSession,
  usePreviewPlanChange,
} from "@/hooks/use-subscription";

interface PlanCardProps {
  plan: Plan;
  isPopular: boolean;
  isCurrent: boolean;
  hasActiveSubscription: boolean;
}

/**
 * Individual plan card component
 * Displays plan details, pricing, features, and upgrade button
 */
export const PlanCard = React.memo(
  ({ plan, isPopular, isCurrent, hasActiveSubscription }: PlanCardProps) => {
    const { t } = useTranslation("common");
    const createCheckout = useCreateCheckoutSession();
    const changePlan = useChangePlan();
    const previewPlanChange = usePreviewPlanChange();

    // Estado do modal de preview
    const [showPreview, setShowPreview] = React.useState(false);
    const [previewData, setPreviewData] = React.useState<PreviewPlanChangeResponse | null>(null);

    /**
     * Translates plan name to current language
     * Falls back to API name if translation not found
     */
    const translatedPlanName = React.useMemo(() => {
      const translationKey = `plans.fullPlanNames.${plan.name}`;
      const translated = t(translationKey);
      // Se a tradução não existir, retorna o nome da API sem sufixo
      if (translated === translationKey) {
        return plan.name.replace(/\s*\((Annual|Monthly)\)\s*/gi, "").trim();
      }
      return translated;
    }, [plan.name, t]);

    /**
     * Removes billing interval suffix from plan name (for upgrade button)
     */
    const cleanPlanName = React.useMemo(
      () =>
        translatedPlanName
          .replace(/\s*\((Anual|Mensal|Annual|Monthly|Mensuel|Annuel)\)\s*/gi, "")
          .trim(),
      [translatedPlanName]
    );

    /**
     * Calculates monthly price (even for annual plans)
     */
    const monthlyPrice = React.useMemo(
      () => (plan.interval === "year" ? Math.round(plan.price / 12) : plan.price),
      [plan.interval, plan.price]
    );

    /**
     * Handles plan change (upgrade/downgrade) or initial checkout
     * - If has active subscription: shows preview modal first
     * - If no subscription: creates new checkout session
     */
    const handlePlanAction = React.useCallback(() => {
      if (hasActiveSubscription) {
        // Já tem assinatura → busca preview antes de mudar
        previewPlanChange.mutate(
          { newPlanId: plan.id },
          {
            onSuccess: (data) => {
              setPreviewData(data);
              setShowPreview(true);
            },
          }
        );
      } else {
        // Primeira assinatura → cria checkout session
        const currentUrl = window.location.origin + window.location.pathname;
        createCheckout.mutate({
          planId: plan.id,
          successUrl: `${currentUrl}?checkout=success`,
          cancelUrl: `${currentUrl}?checkout=canceled`,
        });
      }
    }, [hasActiveSubscription, plan, changePlan, createCheckout, previewPlanChange]);

    /**
     * Confirma a mudança de plano após ver o preview
     */
    const handleConfirmChange = React.useCallback(() => {
      changePlan.mutate(
        { newPlanId: plan.id },
        {
          onSuccess: () => {
            setShowPreview(false);
            setPreviewData(null);
          },
        }
      );
    }, [plan.id, changePlan]);

    /**
     * Determines if button is in loading state
     */
    const isLoading = createCheckout.isPending || changePlan.isPending;

    return (
      <>
        <PlanChangePreviewModal
          open={showPreview}
          onOpenChange={setShowPreview}
          preview={previewData}
          isLoading={previewPlanChange.isPending}
          onConfirm={handleConfirmChange}
          isConfirming={changePlan.isPending}
        />

        <Card
          className={`relative flex flex-col h-full ${isPopular ? "border-blue-500 shadow-lg" : ""} ${isCurrent ? "bg-blue-50 border-blue-200" : ""}`}
        >
          {isPopular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600 text-white">
                <Zap className="w-3 h-3 mr-1" />
                {t("plans.mostPopular")}
              </Badge>
            </div>
          )}

          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl mb-4">{translatedPlanName}</CardTitle>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {formatPrice(monthlyPrice, plan.currency)}
                <span className="text-lg font-normal text-muted-foreground">
                  {t("plans.perMonth")}
                </span>
              </div>
              <div className="h-6">
                {plan.interval === "year" && (
                  <p className="text-xs text-muted-foreground">
                    {t("plans.billedYearly", { price: formatPrice(plan.price, plan.currency) })}
                  </p>
                )}
              </div>
              <div className="h-[48px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center leading-tight">
                  {plan.description}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col flex-grow pt-0">
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 min-h-[28px]">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-tight">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full mt-auto"
              variant={isCurrent ? "secondary" : isPopular ? "default" : "outline"}
              disabled={isCurrent || isLoading}
              onClick={handlePlanAction}
            >
              {isCurrent ? (
                <>
                  <Check className="w-4 h-4" />
                  {t("plans.currentPlan")}
                </>
              ) : (
                <>
                  <ArrowUpCircle className="w-4 h-4" />
                  {isLoading
                    ? t("status.processing")
                    : hasActiveSubscription
                      ? t("plans.changeToPlan", { plan: cleanPlanName })
                      : t("plans.upgradeButton", { plan: cleanPlanName })}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }
);

PlanCard.displayName = "PlanCard";
