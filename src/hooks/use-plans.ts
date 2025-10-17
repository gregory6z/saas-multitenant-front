import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "@/lib/axios";

// Zod schema for plan validation
const PlanSchema = z.object({
  id: z.string(), // Identificador do plano (ex: "plan-starter", "plan-pro")
  name: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  price: z.number(), // Preço em centavos (ex: 3900 = €39.00)
  interval: z.enum(["month", "year"]),
  currency: z.string(),
});

const PlansResponseSchema = z.object({
  plans: z.array(PlanSchema),
});

export type Plan = z.infer<typeof PlanSchema>;
export type PlansResponse = z.infer<typeof PlansResponseSchema>;

/**
 * Hook para buscar planos disponíveis (rota pública)
 *
 * TanStack Query v5 optimizations:
 * - staleTime: 30min - planos raramente mudam
 * - gcTime: 60min - mantém em cache durante sessão
 * - refetchOnWindowFocus: false - evita refetch desnecessário
 */
export function usePlans() {
  const plansQuery = useQuery({
    queryKey: ["plans"],
    queryFn: async (): Promise<Plan[]> => {
      const response = await api.get("/subscriptions/plans");
      console.log("[usePlans] Resposta do backend:", response.data);
      return response.data.plans;
    },
    staleTime: 30 * 60 * 1000, // 30min - planos não mudam frequentemente
    gcTime: 60 * 60 * 1000, // 60min - mantém em cache durante sessão
    refetchOnWindowFocus: false, // Evita refetch ao retornar à página
  });

  return {
    plans: plansQuery.data ?? [],
    isLoading: plansQuery.isLoading,
    isError: plansQuery.isError,
    error: plansQuery.error,
    refetch: plansQuery.refetch,
  };
}

/**
 * Formata preço de centavos para string com símbolo de moeda
 * Ex: 3900, "eur" → "€39,00"
 * Ex: 12900, "usd" → "$129.00"
 * Ex: 44900, "brl" → "R$ 449,00"
 */
export function formatPrice(priceInCents: number, currency: string): string {
  const price = priceInCents / 100;

  const currencyConfig: Record<
    string,
    {
      symbol: string;
      position: "before" | "after";
      decimalSeparator: string;
      thousandsSeparator: string;
    }
  > = {
    eur: {
      symbol: "€",
      position: "before",
      decimalSeparator: ",",
      thousandsSeparator: ".",
    },
    usd: {
      symbol: "$",
      position: "before",
      decimalSeparator: ".",
      thousandsSeparator: ",",
    },
    brl: {
      symbol: "R$",
      position: "before",
      decimalSeparator: ",",
      thousandsSeparator: ".",
    },
  };

  const config = currencyConfig[currency.toLowerCase()] || {
    symbol: currency.toUpperCase(),
    position: "before" as const,
    decimalSeparator: ".",
    thousandsSeparator: ",",
  };

  // Formata número com separadores
  const [integerPart, decimalPart] = price.toFixed(2).split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparator);
  const formattedPrice = `${formattedInteger}${config.decimalSeparator}${decimalPart}`;

  // Posiciona símbolo
  if (config.position === "after") {
    return `${formattedPrice} ${config.symbol}`;
  }
  return `${config.symbol} ${formattedPrice}`;
}
