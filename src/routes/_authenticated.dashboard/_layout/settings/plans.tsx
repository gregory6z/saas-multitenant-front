import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown, Zap } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, type Plan, usePlans } from "@/hooks/use-plans";
import { useSubscription } from "@/hooks/use-subscription";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/settings/plans")({
  component: PlansPage,
});

type BillingInterval = "month" | "year";

// Mapeamento de planId para nome legível (PT-BR)
const PLAN_NAMES: Record<string, string> = {
  "plan-trial": "Teste",
  "plan-starter": "Inicial",
  "plan-pro": "Profissional",
  "plan-enterprise": "Empresarial",
};

// Mapeamento de status para português
const STATUS_NAMES: Record<string, string> = {
  active: "Ativo",
  trialing: "Em teste",
  canceled: "Cancelado",
  incomplete: "Incompleto",
  incomplete_expired: "Expirado",
  past_due: "Atrasado",
  unpaid: "Não pago",
};

function PlansPage() {
  const { t } = useTranslation("common");
  const { plans, isLoading: plansLoading } = usePlans();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();

  // Se o plano atual for trial, default para anual. Senão, mensal.
  const defaultInterval: BillingInterval = subscription?.planId === "plan-trial" ? "year" : "month";
  const [selectedInterval, setSelectedInterval] = React.useState<BillingInterval>(defaultInterval);

  // Filtra planos pelo intervalo selecionado
  const filteredPlans = plans.filter((plan) => plan.interval === selectedInterval);

  // Identificar qual é o plano popular (Pro Mensal e Pro Anual)
  const isPopularPlan = (plan: Plan): boolean => {
    return plan.id === "plan-pro" || (plan.name.includes("Pro") && plan.interval === "year");
  };

  if (plansLoading || subscriptionLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pt-4 md:pt-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando planos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-4 md:pt-8 px-4 md:px-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        {/* Título e Plano Atual */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">{t("sidebar.plans")}</h1>

          {/* Plano Atual Simplificado */}
          {subscription && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 w-fit h-fit shadow-sm">
              <Crown className="w-4 h-4 text-blue-600" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Minha assinatura:</span>
                <span className="text-sm font-semibold text-blue-700">
                  {PLAN_NAMES[subscription.planId] || subscription.planId}
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
                {STATUS_NAMES[subscription.status] || subscription.status}
              </Badge>
            </div>
          )}
        </div>

        {/* Tabs Centralizados */}
        <div className="flex justify-center">
          <Tabs
            value={selectedInterval}
            onValueChange={(value) => setSelectedInterval(value as BillingInterval)}
            className="w-fit"
          >
            <TabsList>
              <TabsTrigger value="month">Mensal</TabsTrigger>
              <TabsTrigger value="year">
                Anual
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                  -20%
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
            <Card
              key={plan.id}
              className={`relative flex flex-col h-full ${isPopular ? "border-blue-500 shadow-lg" : ""} ${isCurrent ? "bg-blue-50 border-blue-200" : ""}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl mb-4">
                  {plan.name.replace(/\s*\((Anual|Mensal)\)\s*/gi, "").trim()}
                </CardTitle>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    {/* Sempre mostra preço mensal, mesmo para planos anuais */}
                    {formatPrice(
                      plan.interval === "year" ? Math.round(plan.price / 12) : plan.price,
                      plan.currency
                    )}
                    <span className="text-lg font-normal text-muted-foreground">/mês</span>
                  </div>
                  <div className="h-6">
                    {plan.interval === "year" && (
                      <p className="text-xs text-muted-foreground">
                        Cobrado anualmente: {formatPrice(plan.price, plan.currency)}
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
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 min-h-[28px]">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-auto"
                  variant={isCurrent ? "secondary" : isPopular ? "default" : "outline"}
                  disabled={isCurrent}
                >
                  {isCurrent
                    ? "Plano Atual"
                    : `Fazer upgrade para ${plan.name.replace(/\s*\((Anual|Mensal)\)\s*/gi, "").trim()}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Posso mudar meu plano a qualquer momento?</h4>
            <p className="text-sm text-muted-foreground">
              Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças
              serão proporcionais e refletidas no próximo ciclo de faturamento.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">O que acontece se eu exceder meu limite de mensagens?</h4>
            <p className="text-sm text-muted-foreground">
              Se você exceder seu limite mensal de mensagens, seus chatbots continuarão funcionando,
              mas você será cobrado €0,01 por cada mensagem adicional.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Existe um período de teste gratuito?</h4>
            <p className="text-sm text-muted-foreground">
              Sim, todas as novas contas recebem 14 dias de teste gratuito do plano Pro. Não é
              necessário cartão de crédito.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
