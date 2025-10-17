# 🏗️ Guia de Migração: Arquitetura MVVM

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura Proposta](#arquitetura-proposta)
3. [Migração Gradual](#migração-gradual)
4. [Implementação Passo a Passo](#implementação-passo-a-passo)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Checklist de Migração](#checklist-de-migração)
7. [Convenções e Boas Práticas](#convenções-e-boas-práticas)

---

## 🎯 Visão Geral

### **O que é MVVM?**

**MVVM (Model-View-ViewModel)** é um padrão arquitetural que separa responsabilidades em 3 camadas:

- **Model**: Dados e lógica de negócio (schemas, API calls, queries)
- **ViewModel**: Lógica de apresentação (estado da UI, handlers, computação)
- **View**: Interface do usuário (componentes React puros, apenas rendering)

---

### **Estado Atual**

```
src/
├── components/
│   ├── ui/                    # shadcn/ui
│   ├── plans/
│   │   └── plan-card.tsx     # ❌ Lógica + UI misturados (250 linhas)
│   └── modals/
│       └── remove-member-modal.tsx  # ❌ Lógica + UI misturados
│
└── hooks/
    ├── use-plans.ts          # ❌ API + Tanstack Query misturados
    └── use-subscription.ts   # ❌ Tudo junto (300 linhas)
```

**Problemas:**
- ❌ Lógica misturada com UI (difícil testar)
- ❌ Hooks monolíticos (queries + mutations + API)
- ❌ Baixa reutilização de lógica
- ❌ Acoplamento direto com shadcn/ui
- ❌ Difícil manter e escalar

---

### **Estado Desejado (MVVM + Abstrações)**

```
src/
├── models/                              # MODEL LAYER
│   ├── schemas/                        # Zod schemas
│   │   ├── plan.schema.ts
│   │   └── subscription.schema.ts
│   │
│   ├── types/                          # TypeScript types
│   │   └── index.ts
│   │
│   ├── api/                            # HTTP clients (axios puro)
│   │   ├── plans.api.ts
│   │   └── subscription.api.ts
│   │
│   └── queries/                        # Tanstack Query hooks
│       ├── plans/
│       │   ├── use-plans-query.ts
│       │   └── use-plan-query.ts
│       └── subscription/
│           ├── use-subscription-query.ts
│           ├── use-change-plan-mutation.ts
│           └── use-preview-plan-change-mutation.ts
│
├── viewmodels/                          # VIEWMODEL LAYER
│   ├── plans/
│   │   ├── use-plan-card.viewmodel.ts
│   │   └── use-plans-page.viewmodel.ts
│   └── modals/
│       └── use-remove-member-modal.viewmodel.ts
│
├── views/                               # VIEW LAYER
│   ├── plans/
│   │   ├── PlanCard.view.tsx           # UI puro
│   │   └── PlansPage.view.tsx
│   └── modals/
│       └── RemoveMemberModal.view.tsx
│
└── components/                          # UI COMPONENTS
    ├── ui-primitives/                  # shadcn RAW (não tocar)
    │   ├── button.tsx
    │   └── card.tsx
    │
    ├── ui/                             # Abstrações (wrappers)
    │   ├── Button/
    │   │   ├── Button.tsx
    │   │   └── Button.types.ts
    │   └── Card/
    │
    └── domain/                         # Componentes de domínio
        └── plans/
            ├── PlanPrice.tsx
            └── PlanBadge.tsx
```

**Vantagens:**
- ✅ Separação clara de responsabilidades
- ✅ Fácil testar (cada camada isolada)
- ✅ Alta reutilização
- ✅ Zero vendor lock-in (UI abstraído)
- ✅ Escalável

---

## 🏗️ Arquitetura Proposta

### **Camada 1: Model**

**Responsabilidades:**
- Schemas Zod (validação de dados)
- Types TypeScript (derivados de schemas)
- API clients (chamadas HTTP puras com axios)
- Tanstack Query hooks (queries e mutations)

**Exemplo:**
```typescript
// models/api/subscription.api.ts
export const subscriptionApi = {
  getSubscription: async () => api.get("/subscriptions"),
  changePlan: async (input) => api.post("/change-plan", input),
};

// models/queries/subscription/use-subscription-query.ts
export function useSubscriptionQuery() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: () => subscriptionApi.getSubscription(),
  });
}
```

---

### **Camada 2: ViewModel**

**Responsabilidades:**
- Estado local da view (useState)
- Lógica de apresentação (useMemo, useCallback)
- Orquestração de queries/mutations
- Event handlers
- Formatação de dados para UI

**Exemplo:**
```typescript
// viewmodels/plans/use-plan-card.viewmodel.ts
export function usePlanCardViewModel({ plan }) {
  const changePlan = useChangePlanMutation();
  const [showModal, setShowModal] = useState(false);

  const translatedName = useMemo(() => t(plan.name), [plan]);

  const handleUpgrade = useCallback(() => {
    changePlan.mutate({ planId: plan.id });
  }, [plan.id]);

  return { translatedName, showModal, handleUpgrade };
}
```

---

### **Camada 3: View**

**Responsabilidades:**
- Renderização UI (JSX)
- Recebe tudo via props do ViewModel
- Sem lógica de negócio
- Sem chamadas de API
- Sem estado complexo

**Exemplo:**
```typescript
// views/plans/PlanCard.view.tsx
export function PlanCardView({ plan, onUpgrade, translatedName }) {
  return (
    <Card>
      <CardTitle>{translatedName}</CardTitle>
      <Button onClick={onUpgrade}>Upgrade</Button>
    </Card>
  );
}
```

---

### **Camada 4: UI Components**

**ui-primitives/**: shadcn RAW (não tocar diretamente)
**ui/**: Abstrações (wrappers com props customizadas)
**domain/**: Componentes de negócio (PlanPrice, PlanBadge)

---

## 📅 Migração Gradual

### **Fase 1: Preparação (Sem Breaking Changes)** ⏱️ 2-3 dias

**Objetivo:** Criar infraestrutura sem quebrar código existente.

**Tarefas:**
1. Criar estrutura de pastas
2. Mover shadcn para `ui-primitives/`
3. Criar primeiras abstrações UI
4. Extrair primeiro schema Zod
5. Criar primeiro API client

---

### **Fase 2: Migração por Feature** ⏱️ 2-3 dias por feature

**Objetivo:** Migrar uma feature completa (Model → ViewModel → View).

**Prioridade:**

1. **Alta Prioridade** (começar aqui):
   - Plans (mais complexo, bom exemplo)
   - RemoveMemberModal (modal simples, validação rápida)

2. **Média Prioridade**:
   - Auth (login, register)
   - Chatbots
   - Settings

3. **Baixa Prioridade**:
   - Analytics
   - Knowledge Base

---

### **Fase 3: Limpeza** ⏱️ 1-2 dias

**Objetivo:** Remover código antigo e padronizar.

---

## 🚀 Implementação Passo a Passo

### **FASE 1: Preparação**

#### **Passo 1.1: Criar Estrutura de Pastas** ⏱️ 15 min

```bash
# Model
mkdir -p src/models/schemas
mkdir -p src/models/types
mkdir -p src/models/api
mkdir -p src/models/queries/plans
mkdir -p src/models/queries/subscription
mkdir -p src/models/queries/chatbots
mkdir -p src/models/queries/auth
mkdir -p src/models/queries/tenants
mkdir -p src/models/queries/members

# ViewModel
mkdir -p src/viewmodels/plans
mkdir -p src/viewmodels/auth
mkdir -p src/viewmodels/chatbots
mkdir -p src/viewmodels/settings
mkdir -p src/viewmodels/modals

# View
mkdir -p src/views/plans
mkdir -p src/views/auth
mkdir -p src/views/chatbots
mkdir -p src/views/settings
mkdir -p src/views/modals

# UI Components
mkdir -p src/components/ui-primitives
mkdir -p src/components/ui/Button
mkdir -p src/components/ui/Card
mkdir -p src/components/ui/Input
mkdir -p src/components/domain/plans
mkdir -p src/components/domain/common
```

---

#### **Passo 1.2: Mover shadcn para ui-primitives/** ⏱️ 30 min

```bash
# Mover todos os arquivos shadcn
mv src/components/ui/* src/components/ui-primitives/

# Criar arquivo index para facilitar imports
touch src/components/ui-primitives/index.ts
```

**ui-primitives/index.ts:**
```typescript
// Re-export todos os componentes shadcn
export * from "./button";
export * from "./card";
export * from "./input";
export * from "./badge";
export * from "./alert-dialog";
// ... etc
```

**Atualizar components.json:**
```json
{
  "aliases": {
    "components": "@/components/ui-primitives",
    "utils": "@/lib/utils"
  }
}
```

---

#### **Passo 1.3: Criar Primeira Abstração UI (Button)** ⏱️ 30 min

```typescript
// src/components/ui/Button/Button.types.ts

import type { ComponentProps } from "react";
import type { Button as ShadcnButton } from "@/components/ui-primitives/button";

export interface ButtonProps extends Omit<ComponentProps<typeof ShadcnButton>, "asChild"> {
  loading?: boolean;
  fullWidth?: boolean;
}
```

```typescript
// src/components/ui/Button/Button.tsx

import { Loader2 } from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui-primitives/button";
import type { ButtonProps } from "./Button.types";
import { cn } from "@/utils/cn";

/**
 * Abstração do shadcn Button
 * Props customizadas: loading, fullWidth
 */
export function Button({
  variant = "default",
  size = "default",
  loading = false,
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      disabled={loading || props.disabled}
      className={cn({ "w-full": fullWidth }, className)}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </ShadcnButton>
  );
}
```

```typescript
// src/components/ui/Button/index.ts

export { Button } from "./Button";
export type { ButtonProps } from "./Button.types";
```

---

#### **Passo 1.4: Criar Schema Zod (Plan)** ⏱️ 30 min

```typescript
// src/models/schemas/plan.schema.ts

import { z } from "zod";

export const PlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  price: z.number(),
  interval: z.enum(["month", "year"]),
  currency: z.string(),
});

export type Plan = z.infer<typeof PlanSchema>;
```

```typescript
// src/models/types/index.ts

export type { Plan } from "../schemas/plan.schema";
export type { Subscription } from "../schemas/subscription.schema";
// ... etc
```

---

#### **Passo 1.5: Criar API Client (Plans)** ⏱️ 30 min

```typescript
// src/models/api/plans.api.ts

import { api } from "@/lib/axios";
import type { Plan } from "@/models/types";

/**
 * API Client: Plans
 * Apenas chamadas HTTP, sem Tanstack Query
 */
export const plansApi = {
  /**
   * GET /subscriptions/plans
   */
  getPlans: async (): Promise<{ plans: Plan[] }> => {
    const { data } = await api.get("/subscriptions/plans");
    return data;
  },

  /**
   * GET /subscriptions/plans/:id
   */
  getPlan: async (planId: string): Promise<Plan> => {
    const { data } = await api.get(`/subscriptions/plans/${planId}`);
    return data;
  },
};
```

---

#### **Passo 1.6: Criar Query Hook (Plans)** ⏱️ 30 min

```typescript
// src/models/queries/plans/use-plans-query.ts

import { useQuery } from "@tanstack/react-query";
import { plansApi } from "@/models/api/plans.api";
import type { Plan } from "@/models/types";

/**
 * Query Hook: GET plans
 * Apenas data fetching, sem lógica de UI
 */
export function usePlansQuery() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async (): Promise<Plan[]> => {
      const response = await plansApi.getPlans();
      return response.plans;
    },
    staleTime: 30 * 60 * 1000, // 30min
    gcTime: 60 * 60 * 1000, // 1h
    refetchOnWindowFocus: false,
  });
}
```

---

### **FASE 2: Migração de Feature (Plans)**

#### **Passo 2.1: Extrair API Clients (Subscription)** ⏱️ 1 hora

```typescript
// src/models/api/subscription.api.ts

import { api } from "@/lib/axios";

export const subscriptionApi = {
  getSubscription: async () => {
    const { data } = await api.get("/subscriptions");
    return data;
  },

  createCheckoutSession: async (input: {
    planId: string;
    successUrl: string;
    cancelUrl: string;
  }) => {
    const { data } = await api.post("/subscriptions/checkout", input);
    return data;
  },

  cancelSubscription: async (input: { cancelAtPeriodEnd: boolean }) => {
    const { data } = await api.post("/subscriptions/cancel", input);
    return data;
  },

  changePlan: async (input: { newPlanId: string }) => {
    const { data } = await api.post("/subscriptions/change-plan", input);
    return data;
  },

  previewPlanChange: async (input: { newPlanId: string }) => {
    const { data } = await api.post("/subscriptions/preview-plan-change", input);
    return data;
  },

  createPortalSession: async (input: { returnUrl: string }) => {
    const { data } = await api.post("/subscriptions/portal", input);
    return data;
  },
};
```

---

#### **Passo 2.2: Criar Query Hooks (Subscription)** ⏱️ 1 hora

```typescript
// src/models/queries/subscription/use-subscription-query.ts

import { useQuery } from "@tanstack/react-query";
import { subscriptionApi } from "@/models/api/subscription.api";
import type { SubscriptionResponse } from "@/models/types";

export function useSubscriptionQuery() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async (): Promise<SubscriptionResponse> => {
      return subscriptionApi.getSubscription();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
```

```typescript
// src/models/queries/subscription/use-change-plan-mutation.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { subscriptionApi } from "@/models/api/subscription.api";
import type { ChangePlanInput, SubscriptionResponse } from "@/models/types";

export function useChangePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ChangePlanInput): Promise<SubscriptionResponse> => {
      return subscriptionApi.changePlan(input);
    },
    onSuccess: async () => {
      toast.success("Plano atualizado com sucesso!");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["subscription"] }),
        queryClient.invalidateQueries({ queryKey: ["plans"] }),
      ]);
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "Plano inválido ou igual ao atual");
      } else if (status === 403) {
        toast.error("Você não tem permissão para alterar o plano");
      } else if (status === 404) {
        toast.error("Assinatura não encontrada");
      } else {
        toast.error(message || "Erro ao alterar plano");
      }
    },
  });
}
```

```typescript
// src/models/queries/subscription/use-preview-plan-change-mutation.ts

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { subscriptionApi } from "@/models/api/subscription.api";
import type { PreviewPlanChangeInput, PreviewPlanChangeResponse } from "@/models/types";

export function usePreviewPlanChangeMutation() {
  return useMutation({
    mutationFn: async (input: PreviewPlanChangeInput): Promise<PreviewPlanChangeResponse> => {
      return subscriptionApi.previewPlanChange(input);
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "Não foi possível calcular o preview");
      } else if (status === 404) {
        toast.error("Assinatura ou plano não encontrado");
      } else {
        toast.error(message || "Erro ao calcular preview da mudança");
      }
    },
  });
}
```

---

#### **Passo 2.3: Criar ViewModel (PlanCard)** ⏱️ 1 hora

```typescript
// src/viewmodels/plans/use-plan-card.viewmodel.ts

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateCheckoutMutation } from "@/models/queries/subscription/use-create-checkout-mutation";
import { useChangePlanMutation } from "@/models/queries/subscription/use-change-plan-mutation";
import { usePreviewPlanChangeMutation } from "@/models/queries/subscription/use-preview-plan-change-mutation";
import type { Plan, PreviewPlanChangeResponse } from "@/models/types";

interface UsePlanCardViewModelProps {
  plan: Plan;
  isCurrent: boolean;
  hasActiveSubscription: boolean;
}

/**
 * ViewModel: PlanCard
 * Gerencia toda a lógica de apresentação do PlanCard
 */
export function usePlanCardViewModel({
  plan,
  isCurrent,
  hasActiveSubscription,
}: UsePlanCardViewModelProps) {
  const { t } = useTranslation("common");

  // Model hooks
  const createCheckout = useCreateCheckoutMutation();
  const changePlan = useChangePlanMutation();
  const previewPlanChange = usePreviewPlanChangeMutation();

  // View state
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewPlanChangeResponse | null>(null);

  // Computed values
  const translatedPlanName = useMemo(() => {
    const translationKey = `plans.fullPlanNames.${plan.name}`;
    const translated = t(translationKey);
    if (translated === translationKey) {
      return plan.name.replace(/\s*\((Annual|Monthly)\)\s*/gi, "").trim();
    }
    return translated;
  }, [plan.name, t]);

  const cleanPlanName = useMemo(
    () => translatedPlanName.replace(/\s*\((Anual|Mensal|Annual|Monthly|Mensuel|Annuel)\)\s*/gi, "").trim(),
    [translatedPlanName]
  );

  const monthlyPrice = useMemo(
    () => (plan.interval === "year" ? Math.round(plan.price / 12) : plan.price),
    [plan.interval, plan.price]
  );

  const isLoading = createCheckout.isPending || changePlan.isPending;

  // Event handlers
  const handlePlanAction = useCallback(() => {
    if (hasActiveSubscription) {
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
      const currentUrl = window.location.origin + window.location.pathname;
      createCheckout.mutate({
        planId: plan.id,
        successUrl: `${currentUrl}?checkout=success`,
        cancelUrl: `${currentUrl}?checkout=canceled`,
      });
    }
  }, [hasActiveSubscription, plan.id, previewPlanChange, createCheckout]);

  const handleConfirmChange = useCallback(() => {
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

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  // Interface para View
  return {
    // Data
    translatedPlanName,
    cleanPlanName,
    monthlyPrice,

    // State
    showPreview,
    previewData,
    isLoading,

    // Actions
    handlePlanAction,
    handleConfirmChange,
    handleClosePreview,

    // Flags
    isConfirming: changePlan.isPending,
    isPreviewLoading: previewPlanChange.isPending,
  };
}
```

---

#### **Passo 2.4: Criar View (PlanCard)** ⏱️ 1 hora

```typescript
// src/views/plans/PlanCard.view.tsx

import * as React from "react";
import { ArrowUpCircle, Check, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatPrice, type Plan } from "@/hooks/use-plans";
import { PlanChangePreviewModal } from "@/components/modals/plan-change-preview-modal";
import type { PreviewPlanChangeResponse } from "@/models/types";

interface PlanCardViewProps {
  // Data
  plan: Plan;
  isPopular: boolean;
  isCurrent: boolean;
  translatedPlanName: string;
  cleanPlanName: string;
  monthlyPrice: number;

  // State
  showPreview: boolean;
  previewData: PreviewPlanChangeResponse | null;
  isLoading: boolean;
  isConfirming: boolean;
  isPreviewLoading: boolean;

  // Callbacks
  onPlanAction: () => void;
  onConfirmChange: () => void;
  onClosePreview: () => void;
}

/**
 * View: PlanCard
 * Componente puro - apenas renderiza UI
 */
export const PlanCardView = React.memo(({
  plan,
  isPopular,
  isCurrent,
  translatedPlanName,
  cleanPlanName,
  monthlyPrice,
  showPreview,
  previewData,
  isLoading,
  isConfirming,
  isPreviewLoading,
  onPlanAction,
  onConfirmChange,
  onClosePreview,
}: PlanCardViewProps) => {
  const { t } = useTranslation("common");

  return (
    <>
      <PlanChangePreviewModal
        open={showPreview}
        onOpenChange={onClosePreview}
        preview={previewData}
        isLoading={isPreviewLoading}
        onConfirm={onConfirmChange}
        isConfirming={isConfirming}
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
            loading={isLoading}
            onClick={onPlanAction}
          >
            {isCurrent ? (
              <>
                <Check className="w-4 h-4" />
                {t("plans.currentPlan")}
              </>
            ) : (
              <>
                <ArrowUpCircle className="w-4 h-4" />
                {t("plans.changeToPlan", { plan: cleanPlanName })}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  );
});

PlanCardView.displayName = "PlanCardView";
```

---

#### **Passo 2.5: Conectar ViewModel + View na Página** ⏱️ 30 min

```typescript
// src/routes/_authenticated.dashboard/_layout/settings/plans.tsx

import { usePlanCardViewModel } from "@/viewmodels/plans/use-plan-card.viewmodel";
import { PlanCardView } from "@/views/plans/PlanCard.view";
import { usePlansQuery } from "@/models/queries/plans/use-plans-query";
import { useSubscriptionQuery } from "@/models/queries/subscription/use-subscription-query";

function PlansPage() {
  const { data: plans = [], isLoading: plansLoading } = usePlansQuery();
  const { data: subscription } = useSubscriptionQuery();

  if (plansLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <PlanCardContainer
          key={plan.id}
          plan={plan}
          isPopular={plan.id === "plan-pro"}
          isCurrent={subscription?.planId === plan.id}
          hasActiveSubscription={!!subscription}
        />
      ))}
    </div>
  );
}

/**
 * Container: Conecta ViewModel + View
 */
function PlanCardContainer({ plan, isPopular, isCurrent, hasActiveSubscription }) {
  // ViewModel (lógica)
  const viewModel = usePlanCardViewModel({ plan, isCurrent, hasActiveSubscription });

  // View (UI)
  return (
    <PlanCardView
      plan={plan}
      isPopular={isPopular}
      isCurrent={isCurrent}
      {...viewModel}
    />
  );
}

export default PlansPage;
```

---

#### **Passo 2.6: Testar Migração** ⏱️ 30 min

```bash
# Executar dev server
pnpm dev

# Testar:
# 1. Página Plans carrega corretamente?
# 2. PlanCard renderiza?
# 3. Botão de upgrade funciona?
# 4. Modal de preview abre?
# 5. Mudança de plano funciona?
# 6. Toasts aparecem?
```

---

### **FASE 2: Migração de Outras Features**

**Repetir passos 2.1 a 2.6 para:**

1. ✅ **Plans** (exemplo acima)
2. **Auth** (login, register)
3. **Modals** (remove-member, delete-tenant)
4. **Chatbots**
5. **Settings**

---

### **FASE 3: Limpeza**

#### **Passo 3.1: Remover Hooks Antigos** ⏱️ 1 hora

```bash
# Verificar se hooks antigos ainda são usados
grep -r "use-subscription.ts" src/

# Se nenhum uso, deletar
rm src/hooks/use-subscription.ts
rm src/hooks/use-plans.ts
```

---

#### **Passo 3.2: Padronizar Imports** ⏱️ 1 hora

```typescript
// ✅ PADRÃO NOVO
import { usePlansQuery } from "@/models/queries/plans/use-plans-query";
import { usePlanCardViewModel } from "@/viewmodels/plans/use-plan-card.viewmodel";
import { PlanCardView } from "@/views/plans/PlanCard.view";
import { Button } from "@/components/ui/Button";

// ❌ EVITAR
import { Button } from "@/components/ui-primitives/button"; // usar abstração
import { usePlans } from "@/hooks/use-plans"; // usar queries
```

---

#### **Passo 3.3: Documentar Arquitetura** ⏱️ 2 horas

Criar `docs/ARCHITECTURE.md` explicando:
- Estrutura MVVM
- Quando usar cada camada
- Convenções de nomenclatura
- Exemplos

---

## 📚 Exemplos Práticos

### **Exemplo 1: Modal Simples (RemoveMember)**

#### **Model (Query)**

```typescript
// models/queries/members/use-remove-member-mutation.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { membersApi } from "@/models/api/members.api";

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      return membersApi.removeMember(memberId);
    },
    onSuccess: () => {
      toast.success("Membro removido com sucesso");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error("Erro ao remover membro");
    },
  });
}
```

---

#### **ViewModel**

```typescript
// viewmodels/modals/use-remove-member-modal.viewmodel.ts

import { useCallback } from "react";
import { useRemoveMemberMutation } from "@/models/queries/members/use-remove-member-mutation";

interface UseRemoveMemberModalViewModelProps {
  memberId: string;
  onSuccess?: () => void;
}

export function useRemoveMemberModalViewModel({
  memberId,
  onSuccess,
}: UseRemoveMemberModalViewModelProps) {
  const removeMember = useRemoveMemberMutation();

  const handleConfirm = useCallback(() => {
    removeMember.mutate(memberId, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  }, [memberId, removeMember, onSuccess]);

  return {
    isLoading: removeMember.isPending,
    handleConfirm,
  };
}
```

---

#### **View**

```typescript
// views/modals/RemoveMemberModal.view.tsx

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui-primitives/alert-dialog";

interface RemoveMemberModalViewProps {
  memberName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  onConfirm: () => void;
}

export function RemoveMemberModalView({
  memberName,
  open,
  onOpenChange,
  isLoading,
  onConfirm,
}: RemoveMemberModalViewProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover {memberName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. O membro será removido permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Removendo..." : "Remover"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

#### **Uso na Página**

```typescript
// settings/members.tsx

import { useRemoveMemberModalViewModel } from "@/viewmodels/modals/use-remove-member-modal.viewmodel";
import { RemoveMemberModalView } from "@/views/modals/RemoveMemberModal.view";

function MembersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const viewModel = useRemoveMemberModalViewModel({
    memberId: selectedMember?.id,
    onSuccess: () => setModalOpen(false),
  });

  return (
    <>
      <RemoveMemberModalView
        memberName={selectedMember?.name}
        open={modalOpen}
        onOpenChange={setModalOpen}
        {...viewModel}
      />
      {/* ... resto */}
    </>
  );
}
```

---

## ✅ Checklist de Migração

### **Por Feature:**

- [ ] Criar schemas Zod em `models/schemas/`
- [ ] Exportar types em `models/types/`
- [ ] Criar API client em `models/api/`
- [ ] Criar query hooks em `models/queries/[feature]/`
- [ ] Criar mutation hooks em `models/queries/[feature]/`
- [ ] Criar ViewModel em `viewmodels/[feature]/`
- [ ] Criar View em `views/[feature]/`
- [ ] Conectar ViewModel + View na página
- [ ] Testar feature completa
- [ ] Remover código antigo

---

### **Geral:**

- [ ] Criar estrutura de pastas completa
- [ ] Mover shadcn para `ui-primitives/`
- [ ] Criar abstrações UI (Button, Card, Input)
- [ ] Migrar features (prioridade: Plans → Auth → resto)
- [ ] Remover hooks antigos de `hooks/`
- [ ] Padronizar imports
- [ ] Documentar arquitetura
- [ ] Code review final

---

## 📝 Convenções e Boas Práticas

### **1. Nomenclatura de Arquivos**

```
models/schemas/          [entity].schema.ts
models/queries/          use-[entity]-query.ts, use-[action]-mutation.ts
viewmodels/              use-[component].viewmodel.ts
views/                   [Component].view.tsx
```

---

### **2. Separação de Responsabilidades**

**Model:**
- ✅ Schemas Zod
- ✅ API clients (HTTP)
- ✅ Tanstack Query hooks
- ❌ Não tem lógica de UI
- ❌ Não tem estado de view

**ViewModel:**
- ✅ useState, useMemo, useCallback
- ✅ Event handlers
- ✅ Formatação de dados
- ❌ Não tem JSX
- ❌ Não faz chamadas HTTP diretas

**View:**
- ✅ JSX e renderização
- ✅ Recebe tudo via props
- ❌ Não tem lógica de negócio
- ❌ Não faz chamadas API
- ❌ Não usa queries/mutations diretamente

---

### **3. Fluxo de Dados**

```
Page (Orchestrator)
  ↓
ViewModel (Lógica)
  ↓ usa
Model (Queries/Mutations)
  ↓ chama
API Client (HTTP)
  ↓
Backend

ViewModel
  ↓ passa props
View (UI)
```

---

## 📊 Estimativa de Tempo

| Fase | Tempo Estimado |
|------|----------------|
| Fase 1: Preparação | 2-3 dias |
| Fase 2: Plans | 2-3 dias |
| Fase 2: Auth | 2 dias |
| Fase 2: Modals | 1 dia |
| Fase 2: Chatbots | 2 dias |
| Fase 2: Settings | 2 dias |
| Fase 3: Limpeza | 1-2 dias |
| **TOTAL** | **12-15 dias** |

---

## 🚨 Troubleshooting

### **Erro: Circular dependency**

```typescript
// ❌ Problema
// models/types/index.ts importa de viewmodels/
// viewmodels/ importa de models/types/

// ✅ Solução: Types sempre em models/, nunca em viewmodels/
```

---

### **Erro: Hook não funciona no ViewModel**

```typescript
// ❌ Problema: Chamar hook dentro de callback
const handleClick = () => {
  const data = useQuery(); // ❌ Hook dentro de função
};

// ✅ Solução: Chamar hook no topo
const query = useQuery();
const handleClick = () => {
  console.log(query.data); // ✅
};
```

---

## 🎯 Priorização de Migração

### **Alta Prioridade** (Semana 1-2)
1. Plans (exemplo completo)
2. RemoveMemberModal (validação rápida)
3. Auth (crítico)

### **Média Prioridade** (Semana 3-4)
4. Chatbots
5. Settings
6. Knowledge Base

### **Baixa Prioridade** (Semana 5)
7. Analytics
8. Componentes simples

---

**Migração MVVM - Guia Completo ✅**
