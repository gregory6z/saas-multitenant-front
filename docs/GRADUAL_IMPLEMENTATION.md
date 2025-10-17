# 🚀 Guia de Implementação Gradual - Página por Página

## 📋 Índice

1. [Estratégia Geral](#estratégia-geral)
2. [Por Que Página por Página?](#por-que-página-por-página)
3. [Template de Implementação](#template-de-implementação)
4. [Ordem de Implementação](#ordem-de-implementação)
5. [Checklist por Página](#checklist-por-página)
6. [Estimativas](#estimativas)

---

## 🎯 Estratégia Geral

### **Abordagem: Uma Página por Vez (Completa)**

Para cada página, implementar **TUDO** nesta ordem:

1. ✅ **Traduções** (criar JSONs granulares)
2. ✅ **MVVM** (Model → ViewModel → View)
3. ✅ **Testar** (validar funcionamento completo)

**Resultado:** Cada página fica 100% completa antes de ir para a próxima.

---

## 💡 Por Que Página por Página?

### **Vantagens:**

✅ **Progresso visível** - Cada página completa = vitória rápida
✅ **Menos conflitos Git** - Trabalha em arquivos isolados
✅ **Aprendizado incremental** - Melhora a cada implementação
✅ **Testável** - Valida antes de seguir em frente
✅ **Reversível** - Se der problema, só afeta uma página
✅ **Sem breaking changes** - Resto do app continua funcionando

### **Desvantagens de fazer tudo de uma vez:**

❌ Muitos arquivos alterados simultaneamente
❌ Difícil testar
❌ Conflitos no Git
❌ Se algo quebrar, quebra tudo
❌ Difícil reverter

---

## 📋 Template de Implementação

### **Para CADA Página:**

```
┌─────────────────────────────────────────────────────────┐
│ PÁGINA: [Nome da Página]                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ PASSO 1: Traduções (30-60 min)                         │
│   ├─ Criar locales/pt/features/[page]/index.json      │
│   ├─ Criar locales/pt/features/[page]/[component].json│
│   ├─ Criar locales/pt/components/[tipo].json          │
│   ├─ Replicar para EN, FR, ES                         │
│   └─ Atualizar lib/i18n.ts                            │
│                                                         │
│ PASSO 2: Model (30-60 min)                             │
│   ├─ Criar models/schemas/[entity].schema.ts          │
│   ├─ Exportar types em models/types/index.ts          │
│   ├─ Criar models/api/[entity].api.ts                 │
│   ├─ Criar models/queries/[entity]/use-[entity]-query.ts │
│   └─ Criar models/queries/[entity]/use-[action]-mutation.ts │
│                                                         │
│ PASSO 3: ViewModel (1-2 horas)                         │
│   ├─ Criar viewmodels/[page]/use-[page].viewmodel.ts  │
│   ├─ Usar hooks do Model                              │
│   ├─ Implementar lógica de apresentação               │
│   └─ Retornar interface completa                      │
│                                                         │
│ PASSO 4: View (1-2 horas)                              │
│   ├─ Criar views/[page]/[Page].view.tsx               │
│   ├─ Usar useFeatureTranslation                       │
│   ├─ Receber tudo via props                           │
│   └─ Apenas JSX (sem lógica)                          │
│                                                         │
│ PASSO 5: Conectar (30 min)                             │
│   ├─ Atualizar routes/[page].tsx                      │
│   ├─ Chamar ViewModel hook                            │
│   ├─ Passar props para View                           │
│   └─ Adicionar modais (se necessário)                 │
│                                                         │
│ PASSO 6: Testar (30 min)                               │
│   ├─ Funcionalidade completa                          │
│   ├─ Traduções (PT, EN, FR, ES)                       │
│   ├─ Sem regressões                                   │
│   └─ Code review                                      │
│                                                         │
│ TOTAL: 4-6 horas por página                            │
└─────────────────────────────────────────────────────────┘
```

---

## 📅 Ordem de Implementação Sugerida

### **Semana 1: Settings** ⏱️ 13-18h (2-3 dias)

**Prioridade:** Alta (páginas críticas de configuração)

1. **Members** - 4-6h
   - Gerenciamento de membros
   - Convites, remoção, alteração de função
   - Modais: Invite, Remove, ChangeRole

2. **General** - 3-4h
   - Configurações gerais do workspace
   - Nome, URL, imagem
   - Modal: DeleteWorkspace

3. **Billing** - 4-5h
   - Faturas, método de pagamento
   - Histórico de cobranças

4. **Notifications** - 2-3h
   - Preferências de notificação
   - Email, push, in-app

---

### **Semana 2: Auth** ⏱️ 10-13h (2 dias)

**Prioridade:** Alta (fluxo de autenticação)

5. **Login** - 3-4h
   - Formulário de login
   - Validação, erro handling

6. **Register** - 3-4h
   - Criação de conta
   - Validação de email

7. **Reset Password** - 2-3h
   - Recuperação de senha
   - Email de reset

8. **Verify Email** - 2h
   - Verificação de email
   - Resend verification

---

### **Semana 3: Features Principais** ⏱️ 18-22h (3-4 dias)

**Prioridade:** Alta (core features)

9. **Dashboard** - 4-5h
   - Visão geral, métricas
   - Cards, gráficos

10. **Chatbots List** - 4-5h
    - Lista de chatbots
    - Filtros, busca
    - Modais: Create, Delete

11. **Chatbot Detail** - 5-6h
    - Detalhes do chatbot
    - Configurações, training
    - Modais: Edit, Duplicate

12. **Knowledge Base** - 5-6h
    - Gerenciamento de base de conhecimento
    - Upload de documentos
    - Modais: Create, Delete, Edit

---

### **Semana 4: Complementares** ⏱️ 12-15h (2 dias)

**Prioridade:** Média (páginas secundárias)

13. **Analytics** - 4-5h
    - Análises e relatórios
    - Gráficos, tabelas

14. **Plans** - 5-6h
    - Seleção de planos
    - Upgrade/downgrade
    - Modal: PlanPreview

15. **Profile** - 3-4h
    - Perfil do usuário
    - Avatar, senha, preferências

---

## ✅ Checklist por Página

### **Antes de Começar:**

```
PÁGINA: _______________________________

PRÉ-REQUISITOS
□ Estrutura de pastas criada
□ Hook useFeatureTranslation existe
□ lib/i18n.ts configurado
□ Modals genéricos criados (se necessário)
```

---

### **PASSO 1: Traduções** ⏱️ 30-60 min

```
□ Criar locales/pt/features/[page]/index.json
  - Textos compartilhados da feature
  - Títulos, subtítulos, labels
  - Status, roles, etc

□ Criar locales/pt/features/[page]/[component].json (se necessário)
  - Textos específicos de componente (10+ strings)
  - Modal específico
  - Formulário complexo

□ Criar locales/pt/components/[tipo].json (se necessário)
  - Modais genéricos (confirm, delete)
  - Validações de formulário
  - Mensagens de erro

□ Replicar para EN
  - Copiar estrutura
  - Traduzir valores

□ Replicar para FR
  - Copiar estrutura
  - Traduzir valores

□ Replicar para ES
  - Copiar estrutura
  - Traduzir valores

□ Atualizar lib/i18n.ts
  - Import dos novos JSONs
  - Adicionar aos resources (pt, en, fr, es)
```

---

### **PASSO 2: Model** ⏱️ 30-60 min

```
□ Criar models/schemas/[entity].schema.ts
  - Schema Zod principal
  - Input schemas (Create, Update)
  - Exportar types com z.infer

□ Exportar types em models/types/index.ts
  - export type { Entity, CreateInput, UpdateInput } from "../schemas/..."

□ Criar models/api/[entity].api.ts
  - Funções de API (get, create, update, delete)
  - Apenas chamadas HTTP (axios)
  - Sem Tanstack Query

□ Criar models/queries/[entity]/use-[entity]-query.ts
  - useQuery para GET
  - staleTime, gcTime
  - queryKey: ["entity"] ou ["entity", id]

□ Criar models/queries/[entity]/use-[action]-mutation.ts
  - useMutation para POST, PUT, DELETE
  - Toast de sucesso/erro
  - invalidateQueries após sucesso
```

---

### **PASSO 3: ViewModel** ⏱️ 1-2 horas

```
□ Criar viewmodels/[page]/use-[page].viewmodel.ts

□ Importar hooks do Model
  - useEntityQuery
  - useCreateMutation
  - useUpdateMutation
  - useDeleteMutation

□ Criar estado local da view
  - useState para modais (open/close)
  - useState para item selecionado
  - useState para filtros/busca

□ Criar computed values
  - useMemo para dados processados
  - Formatação, filtros, ordenação

□ Criar event handlers
  - useCallback para actions
  - handleOpen*, handleClose*, handleConfirm*
  - Passar callbacks para mutations

□ Retornar interface completa
  - Data (do Model)
  - State (modais, seleções)
  - Actions (handlers)
  - Loading states (isPending, isLoading)
```

---

### **PASSO 4: View** ⏱️ 1-2 horas

```
□ Criar views/[page]/[Page].view.tsx

□ Importar useFeatureTranslation
  - const { t } = useFeatureTranslation("page", "component")

□ Definir interface Props
  - Data do ViewModel
  - State do ViewModel
  - Actions do ViewModel

□ Implementar JSX
  - Header com título e ações
  - Conteúdo principal (table, cards, form)
  - Empty states
  - Loading states
  - Error states

□ Usar traduções granulares
  - t("title"), t("subtitle")
  - t("table.headers.name")
  - t("actions.create")

□ Adicionar modais (se necessário)
  - Import de modais
  - Passar props do ViewModel
  - open, onOpenChange, onConfirm

□ Sem lógica de negócio
  - Não usar useState (exceto UI local trivial)
  - Não usar queries/mutations
  - Apenas renderizar props
```

---

### **PASSO 5: Conectar** ⏱️ 30 min

```
□ Atualizar routes/[page].tsx

□ Import ViewModel
  - import { usePageViewModel } from "@/viewmodels/[page]/use-[page].viewmodel"

□ Import View
  - import { PageView } from "@/views/[page]/[Page].view"

□ Import Modals (se necessário)
  - import { CreateModal, DeleteModal } from "@/components/modals/..."

□ Chamar ViewModel
  - const viewModel = usePageViewModel()

□ Renderizar Modals
  - Antes da View
  - Passar props do ViewModel

□ Renderizar View
  - <PageView {...viewModel} />
  - Spread de todas as props
```

---

### **PASSO 6: Testar** ⏱️ 30 min

```
□ Executar dev server
  - pnpm dev

□ Testar funcionalidade
  - Página carrega sem erros
  - Lista/dados aparecem
  - Ações funcionam (criar, editar, deletar)
  - Modais abrem/fecham
  - Formulários validam
  - Toasts aparecem

□ Testar traduções
  - Trocar para EN (todas strings traduzidas?)
  - Trocar para FR (todas strings traduzidas?)
  - Trocar para ES (todas strings traduzidas?)
  - Voltar para PT

□ Testar edge cases
  - Empty state (sem dados)
  - Loading state (carregando)
  - Error state (erro de API)
  - Validação de formulários

□ Verificar sem regressões
  - Outras páginas continuam funcionando?
  - Não quebrou nada?

□ Code review
  - Código limpo?
  - Sem console.logs?
  - Sem código comentado?
  - Seguiu convenções?
```

---

### **Finalização:**

```
CONCLUÍDO
□ Página totalmente funcional
□ Traduções completas (PT, EN, FR, ES)
□ MVVM implementado corretamente
□ Testes passando
□ Code review aprovado
□ Commit e push

PRÓXIMA PÁGINA: _______________________________
```

---

## 📊 Estimativas de Tempo

### **Por Tipo de Página:**

| Tipo | Descrição | Tempo | Exemplos |
|------|-----------|-------|----------|
| **Simples** | Poucos campos, sem modais complexos | 3-4h | Login, General, Notifications |
| **Média** | Lista com CRUD, 2-3 modais | 4-6h | Members, Chatbots List, Dashboard |
| **Complexa** | Múltiplas views, muitos modais | 5-7h | Chatbot Detail, Plans, Knowledge Base |

---

### **Total por Semana:**

| Semana | Páginas | Tempo Total | Dias Úteis |
|--------|---------|-------------|------------|
| **1** | Settings (4 páginas) | 13-18h | 2-3 dias |
| **2** | Auth (4 páginas) | 10-13h | 2 dias |
| **3** | Features (4 páginas) | 18-22h | 3-4 dias |
| **4** | Complementares (3 páginas) | 12-15h | 2 dias |
| **TOTAL** | **15 páginas** | **53-68h** | **9-11 dias** |

---

## 🎯 Próximos Passos

### **Hoje: Implementar Members**

**Tempo estimado:** 4-6 horas

**Sequência:**
1. ✅ Traduções (30-60min)
2. ✅ Model (30-60min)
3. ✅ ViewModel (1-2h)
4. ✅ View (1-2h)
5. ✅ Conectar (30min)
6. ✅ Testar (30min)

**Resultado:** Página Members 100% completa como exemplo para as próximas.

---

### **Após Members:**

Seguir ordem de implementação:
- General
- Billing
- Notifications
- Login
- Register
- ...

**Meta:** 1-2 páginas por dia, totalizando 15 páginas em 9-11 dias úteis.

---

## 🎯 Dicas Importantes

### **Durante Implementação:**

✅ **Foco total** - Uma página por vez, não pule etapas
✅ **Testar sempre** - Não acumule páginas sem testar
✅ **Commit frequente** - Commit após cada página completa
✅ **Pedir review** - Se possível, code review após cada página
✅ **Documentar bloqueios** - Se travar, documentar e pedir ajuda

### **Evitar:**

❌ Começar várias páginas ao mesmo tempo
❌ Pular testes
❌ Deixar TODOs sem resolver
❌ Copiar/colar sem adaptar
❌ Commitar código quebrado

---

## 📚 Recursos de Apoio

- **MVVM_MIGRATION.md** - Detalhes da arquitetura MVVM
- **TRANSLATION_MIGRATION.md** - Detalhes das traduções granulares
- **CLAUDE.md** - Convenções do projeto

---

**Implementação Gradual - Guia Global ✅**

**Começar agora:** Página Members (4-6h)
