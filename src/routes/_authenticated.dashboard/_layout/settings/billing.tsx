import { createFileRoute } from "@tanstack/react-router";
import { Calendar, CreditCard, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/settings/billing")({
  component: BillingPage,
});

function BillingPage() {
  const { t } = useTranslation("common");

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t("sidebar.billing")}</h1>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {t("settings.billing.currentPlan")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">Pro Plan</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">$29/month • Renews on Jan 15, 2024</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">$29</div>
              <p className="text-sm text-muted-foreground">per month</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">Change Plan</Button>
            <Button variant="outline">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.billing.paymentMethod")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/26</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t("settings.billing.history")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Pro Plan - January 2024</p>
                <p className="text-sm text-muted-foreground">Jan 15, 2024</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">$29.00</span>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Pro Plan - December 2023</p>
                <p className="text-sm text-muted-foreground">Dec 15, 2023</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">$29.00</span>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
