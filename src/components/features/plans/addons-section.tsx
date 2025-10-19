import { Info, Package2, Sparkles } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useAddonsQuery } from "@/api/queries/subscription";
import type { Addon } from "@/api/schemas/subscription.schema";
import { AddonCard } from "@/components/features/plans/addon-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Addons section component
 * Groups and displays available addons by type
 */
export function AddonsSection() {
  const { t } = useTranslation("settings-plans");
  const { data: addonsData, isLoading, isError } = useAddonsQuery();

  // TODO: Replace with real active addons from subscription
  const [activeAddons, setActiveAddons] = React.useState<Set<string>>(new Set());

  const handleToggleAddon = React.useCallback((addonId: string, enabled: boolean) => {
    setActiveAddons((prev) => {
      const next = new Set(prev);
      if (enabled) {
        next.add(addonId);
        // TODO: Call API to activate addon
        console.log("[AddonsSection] Activating addon:", addonId);
      } else {
        next.delete(addonId);
        // TODO: Call API to deactivate addon
        console.log("[AddonsSection] Deactivating addon:", addonId);
      }
      return next;
    });
  }, []);

  // Group addons by type
  const groupedAddons = React.useMemo(() => {
    if (!addonsData?.addons) return {};

    return addonsData.addons.reduce(
      (acc, addon) => {
        if (!acc[addon.addonType]) {
          acc[addon.addonType] = [];
        }
        acc[addon.addonType].push(addon);
        return acc;
      },
      {} as Record<string, Addon[]>
    );
  }, [addonsData]);

  // Type labels and descriptions for section headers
  const typeLabels: Record<string, string> = {
    chatbot: t("addons.types.chatbot"),
    storage: t("addons.types.storage"),
    kb_size_upgrade: t("addons.types.kb_size_upgrade"),
    messages: t("addons.types.messages"),
    api_calls: t("addons.types.api_calls"),
    user: t("addons.types.user"),
    whitelabel: t("addons.types.whitelabel"),
    custom_domain: t("addons.types.custom_domain"),
  };

  const typeDescriptions: Record<string, string> = {
    chatbot: t("addons.typeDescriptions.chatbot"),
    storage: t("addons.typeDescriptions.storage"),
    kb_size_upgrade: t("addons.typeDescriptions.kb_size_upgrade"),
    messages: t("addons.typeDescriptions.messages"),
    api_calls: t("addons.typeDescriptions.api_calls"),
    user: t("addons.typeDescriptions.user"),
    whitelabel: t("addons.typeDescriptions.whitelabel"),
    custom_domain: t("addons.typeDescriptions.custom_domain"),
  };

  const typeExamples: Record<string, string | undefined> = {
    storage: t("addons.examples.storage"),
    kb_size_upgrade: t("addons.examples.kb_size_upgrade"),
  };

  // Custom sort order - priority types first
  const typePriority: Record<string, number> = {
    messages: 1,
    chatbot: 2,
    storage: 3,
    kb_size_upgrade: 4,
    api_calls: 5,
    user: 6,
    whitelabel: 7,
    custom_domain: 8,
  };

  const getSortOrder = (type: string) => typePriority[type] || 999;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Package2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">{t("addons.title")}</h2>
        </div>
        <Separator />
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Package2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">{t("addons.title")}</h2>
        </div>
        <Separator />
        <Alert variant="destructive">
          <AlertDescription>{t("addons.loadError")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!addonsData?.addons || addonsData.addons.length === 0) {
    return null; // Don't show section if no addons available
  }

  // Count active addons
  const activeAddonsCount = activeAddons.size;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Package2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">{t("addons.title")}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{t("addons.description")}</p>
      </div>

      {/* My Addons Card - Only show if has active addons */}
      {activeAddonsCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 w-fit shadow-sm">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("addons.myAddons")}</span>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-semibold">
              {activeAddonsCount} {activeAddonsCount === 1 ? "ativo" : "ativos"}
            </Badge>
          </div>
        </div>
      )}

      <Separator />

      {/* Addons grouped by type */}
      <div className="space-y-12">
        {Object.entries(groupedAddons)
          .sort(([typeA], [typeB]) => getSortOrder(typeA) - getSortOrder(typeB))
          .map(([type, addons]) => (
            <div key={type} className="space-y-5">
              {/* Type Header */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {typeLabels[type] || type}
                </h3>
                {typeDescriptions[type] && (
                  <p className="text-sm text-muted-foreground">
                    {typeDescriptions[type]}
                  </p>
                )}
                {typeExamples[type] && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-900">{typeExamples[type]}</p>
                  </div>
                )}
              </div>

              {/* Addons Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {addons
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((addon) => (
                    <AddonCard
                      key={addon.id}
                      addon={addon}
                      isActive={activeAddons.has(addon.id)}
                      onToggle={handleToggleAddon}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
