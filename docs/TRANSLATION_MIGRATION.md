# 🌐 Guia de Migração: Traduções Granulares (i18n)

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

### **Estado Atual**

```
src/locales/
├── pt/
│   ├── common.json        (500+ linhas - tudo junto)
│   ├── auth.json          (100+ linhas)
│   └── settings.json      (200+ linhas)
├── en/
├── fr/
└── es/
```

**Problemas:**
- ❌ Arquivos monolíticos difíceis de navegar
- ❌ Conflitos frequentes no Git
- ❌ Difícil encontrar strings específicas
- ❌ Carregamento de traduções desnecessárias

---

### **Estado Desejado (Granular)**

```
src/locales/
├── pt/
│   ├── common.json                          # Textos globais (ações, status, etc)
│   │
│   ├── features/                            # Por feature/domínio
│   │   ├── plans/
│   │   │   ├── index.json                  # Textos compartilhados de plans
│   │   │   ├── plan-card.json              # Específico do PlanCard
│   │   │   ├── plan-preview-modal.json     # Modal de preview
│   │   │   └── billing.json                # Billing
│   │   │
│   │   ├── chatbots/
│   │   │   ├── index.json
│   │   │   ├── chatbot-card.json
│   │   │   ├── chatbot-form.json
│   │   │   └── training.json
│   │   │
│   │   ├── auth/
│   │   │   ├── index.json
│   │   │   ├── login.json
│   │   │   ├── register.json
│   │   │   └── reset-password.json
│   │   │
│   │   └── settings/
│   │       ├── index.json
│   │       ├── general.json
│   │       ├── members.json
│   │       └── notifications.json
│   │
│   ├── components/                          # Por tipo de componente
│   │   ├── modals/
│   │   │   ├── confirm.json                # Modais de confirmação
│   │   │   └── delete.json                 # Modais de delete
│   │   │
│   │   ├── forms/
│   │   │   ├── validation.json             # Mensagens de validação
│   │   │   └── placeholders.json           # Placeholders
│   │   │
│   │   ├── tables/
│   │   │   ├── headers.json
│   │   │   └── empty-states.json
│   │   │
│   │   └── navigation/
│   │       ├── sidebar.json
│   │       └── breadcrumbs.json
│   │
│   └── errors/                              # Mensagens de erro
│       ├── api.json                         # Erros de API
│       ├── validation.json                  # Erros de validação
│       └── network.json                     # Erros de rede
│
├── en/  (mesma estrutura)
├── fr/
└── es/
```

**Vantagens:**
- ✅ Fácil navegação e manutenção
- ✅ Menos conflitos no Git
- ✅ Lazy loading (performance)
- ✅ Escalabilidade
- ✅ Reutilização via namespaces

---

## 🏗️ Arquitetura Proposta

### **1. Hierarquia de Namespaces**

```typescript
// Ordem de busca (fallback automático):
// 1. Namespace específico (plans-card)
// 2. Namespace da feature (plans)
// 3. Common (global)

const { t } = useFeatureTranslation("plans", "card");

t("badges.popular")     // ✅ plans-card.json
t("billing.monthly")    // ✅ plans/index.json (fallback)
t("actions.save")       // ✅ common.json (fallback)
```

---

### **2. Estrutura de Keys (JSON)**

```json
{
  "section": {
    "subsection": {
      "key": "valor"
    }
  },
  "actions": {
    "create": "Criar",
    "edit": "Editar",
    "delete": "Deletar"
  },
  "status": {
    "active": "Ativo",
    "inactive": "Inativo"
  },
  "messages": {
    "success": "Sucesso",
    "error": "Erro"
  }
}
```

---

## 📅 Migração Gradual

### **Fase 1: Preparação (Sem Breaking Changes)** ⏱️ 1-2 dias

**Objetivo:** Criar infraestrutura sem quebrar código existente.

**Tarefas:**
1. Criar estrutura de pastas
2. Configurar i18next para múltiplos namespaces
3. Criar hooks customizados
4. Manter arquivos antigos funcionando

**Resultado:** Sistema dual (antigo + novo) funcionando simultaneamente.

---

### **Fase 2: Migração por Feature** ⏱️ 1 semana por feature

**Objetivo:** Migrar uma feature de cada vez.

**Prioridade de Migração:**

1. **Alta Prioridade** (migrar primeiro):
   - Plans (mais complexo, mais strings)
   - Auth (usado em todo o app)
   - Settings (muitas strings específicas)

2. **Média Prioridade**:
   - Chatbots
   - Knowledge Base
   - Analytics

3. **Baixa Prioridade** (último):
   - Modais genéricos
   - Componentes de navegação
   - Errors (pode manter centralizado)

---

### **Fase 3: Limpeza** ⏱️ 1-2 dias

**Objetivo:** Remover arquivos antigos e código duplicado.

**Tarefas:**
1. Deletar arquivos antigos (common.json monolítico)
2. Atualizar imports
3. Documentar convenções
4. Code review

---

## 🚀 Implementação Passo a Passo

### **FASE 1: Preparação (Início)**

#### **Passo 1.1: Criar Estrutura de Pastas** ⏱️ 15 min

```bash
# Criar estrutura completa
mkdir -p src/locales/pt/features/plans
mkdir -p src/locales/pt/features/chatbots
mkdir -p src/locales/pt/features/auth
mkdir -p src/locales/pt/features/settings
mkdir -p src/locales/pt/features/knowledge-base
mkdir -p src/locales/pt/features/analytics

mkdir -p src/locales/pt/components/modals
mkdir -p src/locales/pt/components/forms
mkdir -p src/locales/pt/components/tables
mkdir -p src/locales/pt/components/navigation

mkdir -p src/locales/pt/errors

# Replicar para outros idiomas
mkdir -p src/locales/en/features/plans
mkdir -p src/locales/en/features/chatbots
# ... etc
```

---

#### **Passo 1.2: Criar Arquivos Base** ⏱️ 30 min

```bash
# Criar arquivos vazios (PT)
touch src/locales/pt/features/plans/index.json
touch src/locales/pt/features/plans/plan-card.json
touch src/locales/pt/features/plans/plan-preview-modal.json
touch src/locales/pt/features/plans/billing.json

touch src/locales/pt/components/forms/validation.json
touch src/locales/pt/components/modals/confirm.json

# Replicar para EN, FR, ES
touch src/locales/en/features/plans/index.json
# ... etc
```

---

#### **Passo 1.3: Criar Hook Customizado** ⏱️ 30 min

```bash
mkdir -p src/lib/i18n/hooks
touch src/lib/i18n/hooks/use-feature-translation.ts
```

**Conteúdo do hook:**

```typescript
// src/lib/i18n/hooks/use-feature-translation.ts

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
export function useFeatureTranslation(
  feature: string,
  component?: string
) {
  const namespaces = component
    ? [`${feature}-${component}`, feature, "common"]
    : [feature, "common"];

  return useTranslation(namespaces);
}
```

---

#### **Passo 1.4: Atualizar Configuração i18next** ⏱️ 1 hora

```typescript
// src/lib/i18n.ts (atualizar)

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// ✅ MANTER arquivos antigos (compatibilidade)
import commonPT from "@/locales/pt/common.json";
import commonEN from "@/locales/en/common.json";
import commonFR from "@/locales/fr/common.json";

// ✅ ADICIONAR novos namespaces (granulares)

// Features - Plans
import plansIndexPT from "@/locales/pt/features/plans/index.json";
import plansCardPT from "@/locales/pt/features/plans/plan-card.json";
import plansPreviewModalPT from "@/locales/pt/features/plans/plan-preview-modal.json";
import plansBillingPT from "@/locales/pt/features/plans/billing.json";

import plansIndexEN from "@/locales/en/features/plans/index.json";
import plansCardEN from "@/locales/en/features/plans/plan-card.json";
// ... outros idiomas

// Components
import formsValidationPT from "@/locales/pt/components/forms/validation.json";
import modalsConfirmPT from "@/locales/pt/components/modals/confirm.json";

import formsValidationEN from "@/locales/en/components/forms/validation.json";
// ... outros idiomas

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "pt",
    defaultNS: "common",

    resources: {
      pt: {
        // ✅ Antigo (manter durante migração)
        common: commonPT,

        // ✅ Novo (granular)
        "plans": plansIndexPT,
        "plans-card": plansCardPT,
        "plans-preview-modal": plansPreviewModalPT,
        "plans-billing": plansBillingPT,

        "forms-validation": formsValidationPT,
        "modals-confirm": modalsConfirmPT,
      },

      en: {
        common: commonEN,
        "plans": plansIndexEN,
        "plans-card": plansCardEN,
        "forms-validation": formsValidationEN,
        // ... etc
      },

      fr: {
        common: commonFR,
        // ... etc
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

---

### **FASE 2: Migração por Feature (Plans)**

#### **Passo 2.1: Analisar common.json Atual** ⏱️ 30 min

```bash
# Abrir common.json e identificar:
# 1. Strings específicas de Plans
# 2. Strings genéricas reutilizáveis
# 3. Strings compartilhadas entre features
```

**Exemplo de análise:**

```json
// common.json ANTES
{
  "plans": {
    "title": "Planos",                    // → plans/index.json
    "mySubscription": "Minha assinatura", // → plans/index.json
    "monthly": "Mensal",                  // → plans/index.json
    "yearly": "Anual",                    // → plans/index.json
    "perMonth": "/mês",                   // → plans/index.json
    "currentPlan": "Plano Atual",         // → plans-card.json
    "upgradeButton": "Upgrade",           // → plans-card.json
    "mostPopular": "Mais Popular",        // → plans-card.json
    "preview": {
      "title": "Confirmar",               // → plans-preview-modal.json
      "description": "Revise",            // → plans-preview-modal.json
      // ... etc
    }
  },

  "actions": {
    "save": "Salvar",                     // ✅ MANTER em common.json
    "cancel": "Cancelar",                 // ✅ MANTER em common.json
  }
}
```

---

#### **Passo 2.2: Criar plans/index.json** ⏱️ 30 min

```json
// src/locales/pt/features/plans/index.json

{
  "title": "Planos",
  "subtitle": "Escolha o plano ideal para o seu negócio",
  "mySubscription": "Minha assinatura:",

  "billing": {
    "monthly": "Mensal",
    "yearly": "Anual",
    "perMonth": "/mês",
    "perYear": "/ano",
    "billedMonthly": "Cobrado mensalmente",
    "billedYearly": "Cobrado anualmente: {{price}}",
    "freeMonths": "{{count}} meses grátis"
  },

  "status": {
    "active": "Ativo",
    "trialing": "Período de Teste",
    "canceled": "Cancelado",
    "past_due": "Pagamento Atrasado",
    "unpaid": "Não Pago",
    "incomplete": "Incompleto"
  },

  "names": {
    "trial": "Teste Grátis",
    "starter": "Inicial",
    "pro": "Profissional",
    "business": "Business",
    "enterprise": "Enterprise"
  },

  "intervals": {
    "month": "Mensal",
    "year": "Anual"
  }
}
```

---

#### **Passo 2.3: Criar plans/plan-card.json** ⏱️ 30 min

```json
// src/locales/pt/features/plans/plan-card.json

{
  "badges": {
    "popular": "Mais Popular",
    "current": "Plano Atual",
    "recommended": "Recomendado"
  },

  "actions": {
    "upgrade": "Fazer Upgrade para {{plan}}",
    "downgrade": "Mudar para {{plan}}",
    "changeTo": "Mudar para {{plan}}",
    "current": "Plano Atual",
    "select": "Selecionar {{plan}}"
  },

  "features": {
    "title": "O que está incluído",
    "unlimited": "Ilimitado",
    "included": "Incluído",
    "notIncluded": "Não incluído"
  },

  "pricing": {
    "from": "A partir de",
    "custom": "Personalizado",
    "contactSales": "Entre em contato"
  }
}
```

---

#### **Passo 2.4: Criar plans/plan-preview-modal.json** ⏱️ 30 min

```json
// src/locales/pt/features/plans/plan-preview-modal.json

{
  "title": "Confirmar Mudança de Plano",
  "subtitle": "Revise os detalhes antes de confirmar",
  "calculating": "Calculando mudança...",
  "pleaseWait": "Por favor aguarde enquanto calculamos os valores",

  "sections": {
    "currentPlan": {
      "title": "Plano Atual",
      "description": "Seu plano ativo no momento"
    },
    "newPlan": {
      "title": "Novo Plano",
      "description": "Plano que você selecionou"
    },
    "proration": {
      "title": "Detalhes da Cobrança",
      "creditAmount": "Crédito do plano anterior",
      "amountDue": "Valor a pagar agora",
      "nextInvoice": "Próxima fatura",
      "proratedInfo": "O valor foi calculado proporcionalmente até {{date}}",
      "noCharge": "Sem cobrança adicional",
      "immediateCharge": "Cobrança imediata"
    }
  },

  "actions": {
    "confirm": "Confirmar Mudança",
    "cancel": "Cancelar",
    "goBack": "Voltar"
  },

  "warnings": {
    "downgrade": "Ao fazer downgrade, alguns recursos podem ser desativados",
    "immediate": "A mudança será aplicada imediatamente",
    "nextCycle": "A mudança será aplicada no próximo ciclo"
  }
}
```

---

#### **Passo 2.5: Replicar para EN, FR, ES** ⏱️ 2 horas

```bash
# Copiar estrutura e traduzir
cp src/locales/pt/features/plans/index.json src/locales/en/features/plans/
cp src/locales/pt/features/plans/plan-card.json src/locales/en/features/plans/
# ... traduzir conteúdo
```

---

#### **Passo 2.6: Atualizar Componentes (PlanCard)** ⏱️ 1 hora

**ANTES:**

```typescript
// src/components/plans/plan-card.tsx

import { useTranslation } from "react-i18next";

export function PlanCard({ plan, isPopular, isCurrent }) {
  const { t } = useTranslation("common"); // ❌ Antigo

  return (
    <Card>
      <Badge>{t("plans.mostPopular")}</Badge> {/* ❌ */}
      <div>{t("plans.perMonth")}</div>        {/* ❌ */}
      <Button>{t("plans.currentPlan")}</Button> {/* ❌ */}
    </Card>
  );
}
```

**DEPOIS:**

```typescript
// src/components/plans/plan-card.tsx

import { useFeatureTranslation } from "@/lib/i18n/hooks/use-feature-translation";

export function PlanCard({ plan, isPopular, isCurrent }) {
  // ✅ Novo hook granular
  const { t } = useFeatureTranslation("plans", "card");

  return (
    <Card>
      <Badge>{t("badges.popular")}</Badge>     {/* ✅ plans-card.json */}
      <div>{t("billing.perMonth")}</div>        {/* ✅ plans/index.json */}
      <Button>{t("actions.current")}</Button>   {/* ✅ plans-card.json */}
    </Card>
  );
}
```

---

#### **Passo 2.7: Atualizar i18n.ts (Adicionar Namespaces)** ⏱️ 15 min

```typescript
// src/lib/i18n.ts

// Adicionar imports
import plansIndexPT from "@/locales/pt/features/plans/index.json";
import plansCardPT from "@/locales/pt/features/plans/plan-card.json";
import plansPreviewModalPT from "@/locales/pt/features/plans/plan-preview-modal.json";

// ... EN, FR, ES

// Adicionar aos resources
resources: {
  pt: {
    common: commonPT,
    "plans": plansIndexPT,
    "plans-card": plansCardPT,
    "plans-preview-modal": plansPreviewModalPT,
  },
  // ... outros idiomas
}
```

---

#### **Passo 2.8: Testar e Validar** ⏱️ 30 min

```bash
# Executar dev server
pnpm dev

# Testar:
# 1. Abrir página de Plans
# 2. Trocar idioma (PT → EN → FR → ES)
# 3. Verificar todas as strings
# 4. Verificar fallbacks (se alguma string não traduzida)
# 5. Verificar interpolação ({{price}}, {{plan}})
```

---

### **FASE 2: Migração de Outras Features**

**Repetir passos 2.1 a 2.8 para cada feature:**

1. ✅ **Plans** (exemplo acima)
2. **Auth** (próxima prioridade)
3. **Settings**
4. **Chatbots**
5. **Knowledge Base**
6. **Analytics**

---

### **FASE 3: Limpeza**

#### **Passo 3.1: Verificar Migrações Completas** ⏱️ 30 min

```bash
# Grep para encontrar usos antigos
grep -r "useTranslation(\"common\")" src/
grep -r "t(\"plans\." src/

# Deve retornar apenas uses legítimos de common.json
```

---

#### **Passo 3.2: Remover Seções Antigas de common.json** ⏱️ 1 hora

```json
// common.json ANTES (500 linhas)
{
  "plans": { ... },      // ❌ Remover (migrado)
  "chatbots": { ... },   // ❌ Remover (migrado)
  "settings": { ... },   // ❌ Remover (migrado)

  "actions": { ... },    // ✅ MANTER (genérico)
  "status": { ... },     // ✅ MANTER (genérico)
  "time": { ... },       // ✅ MANTER (genérico)
}
```

```json
// common.json DEPOIS (100 linhas)
{
  "actions": {
    "save": "Salvar",
    "cancel": "Cancelar",
    "delete": "Deletar",
    "edit": "Editar",
    "create": "Criar"
  },

  "status": {
    "loading": "Carregando...",
    "error": "Erro",
    "success": "Sucesso"
  },

  "time": {
    "now": "Agora",
    "today": "Hoje",
    "yesterday": "Ontem"
  }
}
```

---

#### **Passo 3.3: Documentar Convenções** ⏱️ 1 hora

Criar `docs/I18N_CONVENTIONS.md` com:
- Estrutura de pastas
- Quando criar arquivo separado
- Nomenclatura de keys
- Exemplos

---

#### **Passo 3.4: Code Review** ⏱️ 2 horas

- Revisar todos os arquivos migrados
- Verificar consistência de nomenclatura
- Validar traduções
- Testar em todos os idiomas

---

## 📚 Exemplos Práticos

### **Exemplo 1: Validação de Formulários**

```typescript
// viewmodels/auth/use-login-form.viewmodel.ts

import { z } from "zod";
import { useTranslation } from "@/lib/i18n/hooks/use-translation";

export function useLoginFormViewModel() {
  const { t } = useTranslation("forms-validation");

  const loginSchema = z.object({
    email: z
      .string()
      .min(1, t("required", { field: "Email" }))
      .email(t("email")),
    password: z
      .string()
      .min(6, t("minLength", { field: "Senha", count: 6 })),
  });

  // ... resto
}
```

```json
// components/forms/validation.json (PT)
{
  "required": "{{field}} é obrigatório",
  "email": "Email inválido",
  "minLength": "{{field}} deve ter no mínimo {{count}} caracteres",
  "maxLength": "{{field}} deve ter no máximo {{count}} caracteres"
}
```

---

### **Exemplo 2: Modal de Confirmação**

```typescript
// views/modals/DeleteTenantModal.view.tsx

import { useFeatureTranslation } from "@/lib/i18n/hooks/use-feature-translation";

export function DeleteTenantModal({ tenantName, onConfirm }) {
  const { t } = useFeatureTranslation("settings", "general");
  const { t: tModal } = useTranslation("modals-confirm");

  return (
    <AlertDialog>
      <AlertDialogTitle>
        {tModal("delete.title", { item: tenantName })}
      </AlertDialogTitle>
      <AlertDialogDescription>
        {t("deleteWarning1")}
      </AlertDialogDescription>
    </AlertDialog>
  );
}
```

---

## ✅ Checklist de Migração

### **Por Feature:**

- [ ] Criar pasta `features/[feature]/`
- [ ] Criar `index.json` (textos compartilhados)
- [ ] Criar `[component].json` para cada componente com 10+ strings
- [ ] Traduzir para EN, FR, ES
- [ ] Adicionar imports em `i18n.ts`
- [ ] Atualizar componentes para usar `useFeatureTranslation`
- [ ] Testar em todos os idiomas
- [ ] Remover seção antiga de `common.json`

---

### **Geral:**

- [ ] Criar estrutura de pastas completa
- [ ] Criar hook `useFeatureTranslation`
- [ ] Atualizar `i18n.ts` com múltiplos namespaces
- [ ] Migrar features (prioridade: Plans → Auth → Settings → resto)
- [ ] Limpar `common.json` (manter apenas genéricos)
- [ ] Documentar convenções
- [ ] Code review final

---

## 📝 Convenções e Boas Práticas

### **1. Quando Criar Arquivo Separado**

✅ **Criar arquivo separado quando:**
- Componente tem 10+ strings traduzíveis
- Textos são específicos daquele componente
- Componente é reutilizado em múltiplos lugares

❌ **Usar arquivo da feature (index.json) quando:**
- Componente tem < 10 strings
- Textos são compartilhados com outros componentes
- Strings são genéricas

---

### **2. Nomenclatura de Keys**

```json
{
  "section": {              // ✅ Agrupar por seção
    "subsection": {
      "key": "valor"
    }
  },

  "actions": { },           // ✅ Ações agrupadas
  "status": { },            // ✅ Status agrupados
  "messages": { },          // ✅ Mensagens agrupadas
  "fields": { },            // ✅ Campos de formulário
  "labels": { },            // ✅ Labels
  "placeholders": { }       // ✅ Placeholders
}
```

---

### **3. Hierarquia de Fallback**

```typescript
const { t } = useFeatureTranslation("plans", "card");

// Busca:
// 1. plans-card.json
// 2. plans/index.json
// 3. common.json
```

---

### **4. Interpolação**

```json
{
  "welcome": "Bem-vindo, {{name}}!",
  "count": "{{count}} item",
  "count_plural": "{{count}} itens",
  "price": "{{price}} por {{interval}}"
}
```

```typescript
t("welcome", { name: "João" })
t("count", { count: 5 })  // Plural automático
t("price", { price: "€39", interval: "mês" })
```

---

## 🎯 Priorização de Migração

### **Alta Prioridade** (Semana 1-2)
1. Plans (complexo, muitas strings)
2. Auth (usado em todo app)
3. Settings (muitas strings específicas)

### **Média Prioridade** (Semana 3-4)
4. Chatbots
5. Knowledge Base
6. Analytics

### **Baixa Prioridade** (Semana 5)
7. Modais genéricos
8. Navegação
9. Errors

---

## 📊 Estimativa de Tempo

| Fase | Tempo Estimado |
|------|----------------|
| Fase 1: Preparação | 1-2 dias |
| Fase 2: Plans | 1 dia |
| Fase 2: Auth | 1 dia |
| Fase 2: Settings | 1 dia |
| Fase 2: Chatbots | 1 dia |
| Fase 2: Knowledge Base | 1 dia |
| Fase 2: Analytics | 1 dia |
| Fase 3: Limpeza | 1-2 dias |
| **TOTAL** | **8-10 dias** |

---

## 🚨 Troubleshooting

### **Erro: Namespace não encontrado**

```typescript
// ❌ Erro
const { t } = useFeatureTranslation("planss", "card"); // typo

// ✅ Solução
const { t } = useFeatureTranslation("plans", "card");
```

### **Erro: String não traduzida**

```typescript
// ❌ Mostra chave ao invés do texto
t("badges.popularr") // typo

// ✅ Verificar:
// 1. Key existe no JSON?
// 2. Namespace correto?
// 3. Import correto em i18n.ts?
```

### **Erro: Interpolação não funciona**

```json
// ❌ JSON inválido
{ "welcome": "Olá {{name}}" }

// ✅ JSON válido (escapar chaves no JSON)
{ "welcome": "Olá {{name}}" }
```

---

## 📚 Recursos Adicionais

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Interpolation Guide](https://www.i18next.com/translation-function/interpolation)
- [Pluralization Guide](https://www.i18next.com/translation-function/plurals)

---

**Migração Granular de Traduções - Guia Completo ✅**
