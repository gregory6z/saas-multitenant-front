import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/_layout/settings/plans")({
  component: PlansPage,
});

function PlansPage() {
  const { t } = useTranslation("common");

  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "month",
      description: "Perfect for individuals and small projects",
      features: [
        "Up to 3 chatbots",
        "1,000 messages/month",
        "Basic analytics",
        "Email support",
        "Standard integrations",
      ],
      popular: false,
      current: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "month",
      description: "Best for growing businesses and teams",
      features: [
        "Up to 10 chatbots",
        "10,000 messages/month",
        "Advanced analytics",
        "Priority support",
        "All integrations",
        "Custom branding",
        "API access",
      ],
      popular: true,
      current: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "month",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited chatbots",
        "100,000 messages/month",
        "Custom analytics",
        "24/7 phone support",
        "Enterprise integrations",
        "White-label solution",
        "Advanced API",
        "Dedicated success manager",
      ],
      popular: false,
      current: false,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-4 md:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t("sidebar.plans")}</h1>
      </div>

      {/* Current Plan */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-blue-600" />
            Current Plan: Pro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                You're currently on the Pro plan with 7,340 messages used this month.
              </p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? "border-blue-500 shadow-lg" : ""} ${plan.current ? "bg-blue-50 border-blue-200" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.current ? "secondary" : plan.popular ? "default" : "outline"}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Can I change my plan anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and
              reflected in your next billing cycle.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">What happens if I exceed my message limit?</h4>
            <p className="text-sm text-muted-foreground">
              If you exceed your monthly message limit, your chatbots will continue to work, but
              you'll be charged for overage at $0.01 per additional message.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Is there a free trial?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, all new accounts get a 14-day free trial of the Pro plan. No credit card
              required.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
