import { useTranslation } from "react-i18next";

/**
 * Hook para carregar tradução de feature específica
 * Carrega automaticamente index + componente específico
 *
 * @param feature - Nome da feature (ex: "plans", "chatbots")
 * @param component - Nome do componente (ex: "card", "form")
 * @returns Hook do i18next com múltiplos namespaces
 *
 * @example
 * // Carrega plans/index.json + plans/plan-card.json
 * const { t } = useFeatureTranslation("plans", "card");
 *
 * t("badges.popular")     // plans-card.json
 * t("billing.monthly")    // plans/index.json (fallback)
 * t("actions.save")       // common.json (fallback global)
 */
export function useFeatureTranslation(feature: string, component?: string) {
  const namespaces = component
    ? [`${feature}-${component}`, feature, "common"]
    : [feature, "common"];

  return useTranslation(namespaces);
}
