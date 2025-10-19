import { createFileRoute } from "@tanstack/react-router"
import { Crown, Gift } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { usePlansQuery } from "@/api/queries/plan";
import { useSubscriptionQuery } from "@/api/queries/subscription";
import type { Plan } from "@/api/schemas/plan.schema";
import { AddonsSection } from "@/components/features/plans/addons-section";
import { PlanCard } from "@/components/features/plans/plan-card";
import { PageHeader } from "@/components/shared/page-header";
import { PlansPageSkeleton } from "@/components/skeletons/plans-page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/settings/plans")({
  component: PlansPage,
});

type BillingInterval = "month" | "year";

/**
 * Extracts plan key from planId
 * Examples:
 * - "plan-pro" → "pro"
 * - "pro-annual" → "pro"
 * - "starter-monthly" → "starter"
 * - "plan-trial" → "trial"
 */
function getPlanKey(planId: string): string {
  return planId
    .replace("plan-", "") // Remove "plan-" prefix
    .replace("-annual", "") // Remove "-annual" suffix
    .replace("-monthly", ""); // Remove "-monthly" suffix
}

function PlansPage() {
  const { t } = useTranslation("settings-plans");
  const { data: plans = [], isLoading: plansLoading } = usePlansQuery();
  const { data: subscriptionData, isLoading: subscriptionLoading } = useSubscriptionQuery();

  // Extract subscription from response data
  const subscription = subscriptionData?.subscription;

  /**
   * Determina qual tab deve estar selecionada por padrão
   * Prioridade:
   * 1. Se tem plano ativo → mostra a tab do plano atual (month ou year)
   * 2. Se é trial ou não tem plano → mostra tab anual (year)
   */
  const defaultInterval: BillingInterval = React.useMemo(() => {
    if (!subscription) return "year";

    // Busca o plano atual na lista de planos para saber o interval
    const currentPlan = plans.find((p) => p.id === subscription.planId);

    if (currentPlan) {
      // Se encontrou o plano, usa o interval dele
      return currentPlan.interval;
    }

    // Se não encontrou ou é trial, default para anual
    return "year";
  }, [subscription, plans]);

  const [selectedInterval, setSelectedInterval] = React.useState<BillingInterval>(defaultInterval);

  // Atualiza selectedInterval quando defaultInterval mudar (ex: após carregar dados)
  React.useEffect(() => {
    setSelectedInterval(defaultInterval);
  }, [defaultInterval]);

  /**
   * Determines if a plan should be marked as popular
   * Pro plans (monthly and annual) are considered popular
   */
  const isPopularPlan = React.useCallback((plan: Plan): boolean => {
    return plan.id === "plan-pro" || (plan.name.includes("Pro") && plan.interval === "year");
  }, []);

  /**
   * Filters plans by the selected billing interval
   */
  const filteredPlans = React.useMemo(
    () => plans.filter((plan) => plan.interval === selectedInterval),
    [plans, selectedInterval]
  );

  /**
   * Handles billing interval change from tabs
   */
  const handleIntervalChange = React.useCallback((value: string) => {
    setSelectedInterval(value as BillingInterval);
  }, []);

  /**
   * Check if user has an active paid subscription
   */
  const hasActiveSubscription = React.useMemo(
    () =>
      subscription &&
      subscription.planId !== "plan-trial" &&
      (subscription.status === "active" || subscription.status === "trialing"),
    [subscription]
  );

  if (plansLoading || subscriptionLoading) {
    return <PlansPageSkeleton />;
  }

  return (
    <>
      <PageHeader />
      <div className="p-6 md:p-8 overflow-y-auto flex-1">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-6">
            {/* Título e Plano Atual */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>

              {/* Plano Atual Simplificado */}
              {subscription && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 w-fit h-fit shadow-sm">
                  <Crown className="w-4 h-4 text-blue-600" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t("mySubscription")}</span>
                    <span className="text-sm font-semibold text-blue-700">
                      {t(`planNames.${getPlanKey(subscription.planId)}`)}
                    </span>
                  </div>
                  <Badge
                    variant={subscription.status === "active" ? "default" : "secondary"}
                    className={`text-xs font-medium ${
                      subscription.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : subscription.status === "trialing"
                          ? "bg-primary text-white hover:bg-primary"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {t(`status.${subscription.status}`)}
                  </Badge>
                </div>
              )}
            </div>

            {/* Tabs Centralizados */}
            <div className="flex justify-center">
              <Tabs value={selectedInterval} onValueChange={handleIntervalChange} className="w-fit">
                <TabsList>
                  <TabsTrigger value="month">{t("intervals.monthly")}</TabsTrigger>
                  <TabsTrigger value="year">
                    {t("intervals.yearly")}
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-green-100 text-green-700 font-semibold"
                    >
                      <Gift className="w-3 h-3" />
                      {t("freeMonths", { count: 2 })}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {filteredPlans.map((plan) => {
              const isPopular = isPopularPlan(plan);
              const isCurrent = subscription?.planId === plan.id;

              return (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isPopular={isPopular}
                  isCurrent={isCurrent}
                  hasActiveSubscription={hasActiveSubscription || false}
                />
              );
            })}
          </div>

          {/* Addons Section */}
          <AddonsSection />
        </div>
      </div>
    </>
  );
}
