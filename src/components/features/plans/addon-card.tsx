import * as React from "react";
import { useTranslation } from "react-i18next";
import type { Addon } from "@/api/schemas/subscription.schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AddonCardProps {
  addon: Addon;
  isActive: boolean;
  onToggle: (addonId: string, enabled: boolean) => void;
  isLoading?: boolean;
}

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

/**
 * Individual addon card component
 * Displays addon details with toggle switch
 */
export const AddonCard = React.memo(
  ({ addon, isActive, onToggle, isLoading = false }: AddonCardProps) => {
    const { t } = useTranslation("settings-plans");

    const handleToggle = React.useCallback(
      (checked: boolean) => {
        onToggle(addon.id, checked);
      },
      [addon.id, onToggle]
    );

    // Get badge variant based on addon type
    const getAddonTypeBadge = () => {
      const typeMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
        chatbot: { label: "Chatbot", variant: "default" },
        storage: { label: "Storage", variant: "secondary" },
        kb_size_upgrade: { label: "Knowledge Base", variant: "outline" },
        messages: { label: "Mensagens", variant: "default" },
        api_calls: { label: "API Calls", variant: "secondary" },
        user: { label: "Usuário", variant: "outline" },
        whitelabel: { label: "White-label", variant: "default" },
        custom_domain: { label: "Domínio", variant: "secondary" },
      };

      const config = typeMap[addon.addonType] || { label: addon.addonType, variant: "outline" as const };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    // Get metadata display text
    const getMetadataText = () => {
      if (!addon.metadata) return null;

      if (addon.metadata.chatbots) {
        return `+${addon.metadata.chatbots} chatbot${addon.metadata.chatbots > 1 ? "s" : ""}`;
      }
      if (addon.metadata.storage_mb) {
        return `+${addon.metadata.storage_mb} MB`;
      }
      if (addon.metadata.kb_size_increase_mb) {
        return `+${addon.metadata.kb_size_increase_mb} MB por KB`;
      }
      if (addon.metadata.messages) {
        return `+${addon.metadata.messages} mensagens`;
      }
      if (addon.metadata.api_calls) {
        return `+${addon.metadata.api_calls} chamadas API`;
      }
      return null;
    };

    return (
      <Card className={`transition-all ${isActive ? "border-primary bg-primary/5" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg">{addon.name}</CardTitle>
                {getAddonTypeBadge()}
              </div>
              <CardDescription className="text-sm">{addon.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`addon-${addon.id}`} className="sr-only">
                Ativar {addon.name}
              </Label>
              <Switch
                id={`addon-${addon.id}`}
                checked={isActive}
                onCheckedChange={handleToggle}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {formatPrice(addon.price, addon.currency)}
              </span>
              <span className="text-sm text-muted-foreground">
                /{addon.interval === "month" ? t("perMonth") : t("perYear")}
              </span>
            </div>
            {getMetadataText() && (
              <Badge variant="secondary" className="font-mono">
                {getMetadataText()}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

AddonCard.displayName = "AddonCard";
