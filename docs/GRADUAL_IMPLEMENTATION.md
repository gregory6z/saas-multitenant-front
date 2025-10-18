# 🚀 Guia de Implementação Gradual - Página por Página

## 📋 Índice

1. [Estratégia Geral](#estratégia-geral)
2. [Por Que Página por Página?](#por-que-página-por-página)
3. [Migração de Hooks Antigos](#migração-de-hooks-antigos)
4. [Template de Implementação](#template-de-implementação)
5. [Ordem de Implementação](#ordem-de-implementação)
6. [Checklist por Página](#checklist-por-página)
7. [Estimativas](#estimativas)

---

## 🎯 Estratégia Geral

### **Abordagem: Uma Página por Vez (Completa)**

Para cada página, implementar **TUDO** nesta ordem:

1. ✅ **Traduções** (criar JSONs granulares)
2. ✅ **Model Layer** (schemas, API, queries/mutations)
3. ✅ **Componentes** (usando hooks do Model diretamente)
4. ✅ **Testar** (validar funcionamento completo)

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

## 🔄 Migração de Hooks Antigos

### **IMPORTANTE: NÃO USAR MAIS `src/hooks/`**

**Decisão arquitetural:** Toda lógica de API deve estar em `src/api/queries/`, não em `src/hooks/`.

### **Estratégia de Migração:**

#### ❌ **Antes (Hooks Antigos):**

```typescript
// ❌ src/hooks/use-invitations.ts
export function useInvitations() { ... }
export function useCreateInvitation() { ... }
export function useRevokeInvitation() { ... }

// ❌ Componente importando de hooks/
import { useCreateInvitation } from "@/hooks/use-invitations";
```

#### ✅ **Depois (API Layer):**

```typescript
// ✅ src/api/queries/member/use-invitations-query.ts
export function useInvitationsQuery() { ... }

// ✅ src/api/queries/member/use-send-invitation-mutation.ts
export function useSendInvitationMutation() { ... }

// ✅ src/api/queries/member/use-revoke-invitation-mutation.ts
export function useRevokeInvitationMutation() { ... }

// ✅ src/api/queries/member/index.ts
export { useInvitationsQuery } from "./use-invitations-query";
export { useSendInvitationMutation } from "./use-send-invitation-mutation";
export { useRevokeInvitationMutation } from "./use-revoke-invitation-mutation";

// ✅ Componente importando do index
import { useSendInvitationMutation } from "@/api/queries/member";
```

### **Passos para Migrar um Hook Antigo:**

1. **Identificar o hook antigo** em `src/hooks/use-*.ts`
2. **Criar a estrutura na API Layer:**
   - Schemas em `api/schemas/[entity].schema.ts`
   - Client HTTP em `api/client/[entity].api.ts`
   - Queries em `api/queries/[entity]/use-*-query.ts`
   - Mutations em `api/queries/[entity]/use-*-mutation.ts`
   - Index em `api/queries/[entity]/index.ts`
3. **Adicionar i18n aos toasts** nas mutations
4. **Atualizar TODOS os componentes** que usam o hook antigo
5. **Atualizar imports** para usar o index (`@/api/queries/[entity]`)
6. **Deletar o hook antigo** de `src/hooks/`
7. **Testar tudo** (TypeScript + funcionalidade)

### **Hooks que NÃO devem ficar em `src/hooks/`:**

❌ Qualquer hook que faça chamadas de API
❌ Hooks de queries/mutations do Tanstack Query
❌ Hooks que manipulem dados do backend

### **Hooks que PODEM ficar em `src/hooks/`:**

✅ Hooks utilitários puros (ex: `useDebounce`, `useLocalStorage`)
✅ Hooks de UI/UX (ex: `useMediaQuery`, `useClickOutside`)
✅ Hooks de permissões (ex: `useCurrentUserRole` - **apenas lógica de permissões, não fetching**)

### **Exemplo Completo - Members + Invitations:**

```
ANTES:
src/hooks/use-team-members.ts    ❌ Deletado
src/hooks/use-invitations.ts     ❌ Deletado

DEPOIS:
src/api/schemas/member.schema.ts                      ✅ Schemas
src/api/client/member.api.ts                          ✅ Client HTTP
src/api/queries/member/index.ts                       ✅ Exports centralizados
src/api/queries/member/use-members-query.ts           ✅ Query
src/api/queries/member/use-invitations-query.ts       ✅ Query
src/api/queries/member/use-send-invitation-mutation.ts     ✅ Mutation
src/api/queries/member/use-revoke-invitation-mutation.ts   ✅ Mutation
src/api/queries/member/use-resend-invitation-mutation.ts   ✅ Mutation
src/api/queries/member/use-change-role-mutation.ts         ✅ Mutation
src/api/queries/member/use-remove-member-mutation.ts       ✅ Mutation
src/api/queries/member/use-transfer-ownership-mutation.ts  ✅ Mutation
```

---

## 📋 Template de Implementação (Arquitetura Simplificada)

### **Para CADA Página:**

```
┌─────────────────────────────────────────────────────────┐
│ PÁGINA: [Nome da Página]                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ PASSO 1: Traduções (30-60 min)                         │
│   ├─ Criar locales/pt/features/[section]/[page].json  │
│   │   └─ TUDO da página em UM arquivo                 │
│   ├─ Replicar para EN, FR, ES                         │
│   └─ Atualizar lib/i18n.ts                            │
│                                                         │
│ PASSO 2: API Layer (1-2 horas)                         │
│   ├─ Criar api/schemas/[entity].schema.ts             │
│   │   └─ Exportar types diretamente (z.infer)        │
│   ├─ Criar api/client/[entity].api.ts (axios puro)    │
│   ├─ Criar api/queries/[entity]/use-*-query.ts        │
│   └─ Criar api/queries/[entity]/use-*-mutation.ts     │
│                                                         │
│ PASSO 3: Componentes (1-2 horas)                       │
│   ├─ Atualizar em components/features/[feature]/      │
│   ├─ Usar hooks da API diretamente                    │
│   ├─ Usar traduções do namespace correto              │
│   ├─ Dialogs em features/[feature]/dialogs/           │
│   └─ Importar types direto do schema                  │
│                                                         │
│ PASSO 4: Conectar (30 min)                             │
│   ├─ Atualizar routes/[page].tsx                      │
│   ├─ Usar hooks da API diretamente                    │
│   └─ Passar props para componentes                    │
│                                                         │
│ PASSO 5: Testar (30 min)                               │
│   ├─ Funcionalidade completa                          │
│   ├─ Traduções (PT, EN, FR, ES)                       │
│   ├─ TypeScript check                                 │
│   └─ Sem regressões                                   │
│                                                         │
│ TOTAL: 3-5 horas por página                            │
└─────────────────────────────────────────────────────────┘
```

---

## 📅 Ordem de Implementação Sugerida

### **Semana 1: Settings** ⏱️ 10-15h (2 dias)

**Prioridade:** Alta (páginas críticas de configuração)

1. **Members** - 3-5h ✅ **CONCLUÍDO**
   - Gerenciamento de membros
   - Convites, remoção, alteração de função
   - Modais: Invite, Remove, ChangeRole, TransferOwnership
   - **Migração:** Deletado `use-invitations.ts`, criada API layer completa
   - **Hooks:** 8 hooks criados (1 query + 6 mutations para members/invitations)
   - **i18n:** namespace `settings-members` com toasts

2. **General** - 2-3h ✅ **CONCLUÍDO**
   - Configurações gerais do workspace
   - Nome, subdomain, danger zone
   - Modais: DeleteTenant, TransferOwnership
   - **API Layer:** tenant schemas, client, queries/mutations
   - **Hooks:** 3 hooks criados (1 query + 2 mutations)
   - **i18n:** namespace `settings-general` com toasts

3. **Billing** - 3-4h
   - Faturas, método de pagamento
   - Histórico de cobranças

4. **Notifications** - 2-3h
   - Preferências de notificação
   - Email, push, in-app

---

### **Semana 2: Auth** ⏱️ 8-12h (1-2 dias)

**Prioridade:** Alta (fluxo de autenticação)

5. **Login** - 2-3h
   - Formulário de login
   - Validação, erro handling

6. **Register** - 2-3h
   - Criação de conta
   - Validação de email

7. **Reset Password** - 2-3h
   - Recuperação de senha
   - Email de reset

8. **Verify Email** - 2-3h
   - Verificação de email
   - Resend verification

---

### **Semana 3: Features Principais** ⏱️ 15-20h (3 dias)

**Prioridade:** Alta (core features)

9. **Dashboard** - 3-4h
   - Visão geral, métricas
   - Cards, gráficos

10. **Chatbots List** - 4-5h
    - Lista de chatbots
    - Filtros, busca
    - Modais: Create, Delete

11. **Chatbot Detail** - 4-6h
    - Detalhes do chatbot
    - Configurações, training
    - Modais: Edit, Duplicate

12. **Knowledge Base** - 4-5h
    - Gerenciamento de base de conhecimento
    - Upload de documentos
    - Modais: Create, Delete, Edit

---

### **Semana 4: Complementares** ⏱️ 10-12h (2 dias)

**Prioridade:** Média (páginas secundárias)

13. **Analytics** - 3-4h
    - Análises e relatórios
    - Gráficos, tabelas

14. **Plans** - 4-5h
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
□ Git status limpo (commit anterior)
□ Pastas models/ criadas
□ lib/i18n.ts configurado
```

---

### **PASSO 1: Traduções** ⏱️ 30-60 min

```
□ Criar locales/pt/features/[section]/[page].json
  - TUDO da página em um único arquivo
  - Títulos, subtítulos, labels
  - Textos de tabela (headers, etc)
  - Roles, status, actions
  - TODOS os modais da página (título, descrição, botões, loading)
  - Empty states
  - TODOS os erros específicos da página
  - Exemplo: features/settings/members.json contém Members + TODOS os modais

□ Criar locales/pt/components/[tipo].json (APENAS se verdadeiramente genérico)
  - Modais genéricos reutilizados em MÚLTIPLAS features
  - Validações de formulário globais
  - Componentes de navegação compartilhados
  - Regra: Se usado em 3+ páginas diferentes = component
  - Regra: Se usado apenas em 1 página = incluir na página

□ Replicar para EN
  - Copiar estrutura completa
  - Traduzir todos os valores

□ Replicar para FR
  - Copiar estrutura completa
  - Traduzir todos os valores

□ Replicar para ES
  - Copiar estrutura completa
  - Traduzir todos os valores

□ Atualizar lib/i18n.ts
  - Import dos novos JSONs (features/[section]/[page].json)
  - Adicionar aos resources de cada idioma
  - Adicionar namespace ao array ns
  - Exemplo: "settings-members" para features/settings/members.json
```

---

### **PASSO 2: API Layer** ⏱️ 1-2 horas

```
□ Criar api/schemas/[entity].schema.ts
  - Schema Zod principal (ou reutilizar existente)
  - Request schemas (Create, Update)
    ✅ CRÍTICO: Se usado em React Hook Form → Factory function com t()
    ✅ Se usado apenas em mutation hooks → Constant schema
  - Response schemas (sempre constant)
  - Exportar types diretamente: export type Member = z.infer<typeof MemberSchema>
  - NÃO criar pasta types/ separada
  - Exemplo: MemberSchema, InviteMemberRequestSchema, etc

  **REGRA CRÍTICA - Schemas com i18n:**
  - Schemas usados em React Hook Form DEVEM ser factory functions
  - Exemplo: export const createTenantRequestSchema = (t: TFunction) => z.object({...})
  - Types: export type CreateTenantRequest = z.infer<ReturnType<typeof createTenantRequestSchema>>
  - Response schemas e schemas apenas para mutation hooks permanecem constant schemas

□ Criar api/client/[entity].api.ts
  - Funções HTTP puras (axios)
  - get, create, update, delete
  - Sem Tanstack Query
  - Sem toast/validação
  - Importar types direto do schema
  - Exemplo: import type { Member } from "@/api/schemas/member.schema"

□ Criar api/queries/[entity]/use-[entity]-query.ts
  - useQuery para GET
  - Validação com Zod (parse response)
  - staleTime, gcTime, retry strategy
  - queryKey: ["entity"] ou ["entity", id]
  - Importar types direto do schema

□ Criar api/queries/[entity]/use-[action]-mutation.ts
  - useMutation para POST, PUT, DELETE
  - Toast de sucesso/erro (usar useTranslation para i18n)
  - Optimistic updates (se aplicável)
  - invalidateQueries após sucesso
  - Importar types direto do schema
  - Exemplo: useInviteMemberMutation, useRemoveMemberMutation

□ Criar api/queries/[entity]/index.ts
  - Arquivo index para exports centralizados
  - Exportar TODOS os hooks da entidade
  - Separar em seções: Queries e Mutations
  - Exemplo:
    export { useMembersQuery } from "./use-members-query";
    export { useInvitationsQuery } from "./use-invitations-query";
    export { useSendInvitationMutation } from "./use-send-invitation-mutation";
  - Permite import limpo: import { useMembersQuery, useSendInvitationMutation } from "@/api/queries/member";
```

---

### **PASSO 3: Componentes** ⏱️ 1-2 horas

```
□ Organizar em components/features/[feature]/
  - Criar pasta features/[feature]/ para componentes da feature
  - Dialogs em features/[feature]/dialogs/
  - Exemplo: features/members/invite-members-card.tsx
  - Exemplo: features/members/dialogs/remove-member-dialog.tsx

□ Atualizar componentes existentes
  - Trocar imports antigos por hooks da API
  - Exemplo: useTeamMembers() → useMembersQuery()
  - **IMPORTANTE:** Importar SEMPRE do index
  - ✅ Correto: import { useMembersQuery, useSendInvitationMutation } from "@/api/queries/member";
  - ❌ Errado: import { useMembersQuery } from "@/api/queries/member/use-members-query";
  - Importar types direto do schema
  - Exemplo: import type { Member } from "@/api/schemas/member.schema"

□ Usar hooks da API diretamente nos componentes
  - const mutation = useSendInvitationMutation();
  - const { data, isLoading } = useMembersQuery();
  - Hooks chamados DENTRO dos componentes/dialogs (não via callbacks de props)

□ Atualizar traduções
  - useTranslation("settings-members")
  - t("modals.invite.title")
  - t("errors.inviteInvalidEmail")

□ Simplificar lógica
  - Componentes chamam hooks diretamente
  - Sem camadas intermediárias (sem ViewModels)
  - Lógica inline quando simples
```

---

### **PASSO 4: Conectar (Rota)** ⏱️ 30 min

```
□ Atualizar routes/[page].tsx

□ Usar hooks da API diretamente
  - const { data: members, isLoading } = useMembersQuery();
  - const inviteMutation = useInviteMemberMutation();
  - Importar types direto do schema

□ Estado local (se necessário)
  - useState para dialogs (open/close)
  - useState para item selecionado

□ Renderizar componentes
  - Importar de features/[feature]/
  - Passar data/loading/actions via props
  - Exemplo: <TeamMembersList members={members} onRemove={handleRemove} />

□ Renderizar Dialogs
  - Importar de features/[feature]/dialogs/
  - Controlar via estado local
```

---

### **PASSO 5: Testar** ⏱️ 30 min

```
□ TypeScript check
  - pnpm typecheck
  - Sem erros de tipo

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
```

---

### **Finalização:**

```
CONCLUÍDO
□ Página totalmente funcional
□ Traduções completas (PT, EN, FR, ES)
□ API Layer implementado corretamente
□ Components usando API diretamente
□ Organização em features/[feature]/
□ TypeScript sem erros
□ Testes manuais OK
□ Commit e push

PRÓXIMA PÁGINA: _______________________________
```

---

## 📊 Estimativas de Tempo

### **Por Tipo de Página:**

| Tipo | Descrição | Tempo | Exemplos |
|------|-----------|-------|----------|
| **Simples** | Poucos campos, sem modais complexos | 2-3h | Login, General, Notifications |
| **Média** | Lista com CRUD, 2-3 modais | 3-5h | Members, Chatbots List, Dashboard |
| **Complexa** | Múltiplas views, muitos modais | 4-6h | Chatbot Detail, Plans, Knowledge Base |

---

### **Total por Semana:**

| Semana | Páginas | Tempo Total | Dias Úteis |
|--------|---------|-------------|------------|
| **1** | Settings (4 páginas) | 10-15h | 2 dias |
| **2** | Auth (4 páginas) | 8-12h | 1-2 dias |
| **3** | Features (4 páginas) | 15-20h | 3 dias |
| **4** | Complementares (3 páginas) | 10-12h | 2 dias |
| **TOTAL** | **15 páginas** | **43-59h** | **8-9 dias** |

---

## 🎯 Arquitetura Simplificada (Sem MVVM)

### **Estrutura Final:**

```
src/
├── api/                                 # ✅ CAMADA API
│   ├── schemas/
│   │   └── [entity].schema.ts          # Zod schemas + types exportados direto
│   ├── client/
│   │   └── [entity].api.ts             # HTTP puro (axios)
│   └── queries/[entity]/               # Tanstack Query hooks
│       ├── use-[entity]-query.ts
│       └── use-[action]-mutation.ts
│
├── components/                          # ✅ Componentes por feature
│   ├── features/[feature]/
│   │   ├── [component].tsx             # Usa hooks da API
│   │   └── dialogs/                    # Dialogs da feature
│   │       └── [dialog].tsx
│   ├── ui/                              # shadcn/ui (não mexer)
│   ├── shared/                          # Componentes reutilizáveis (futuramente)
│   └── navigation/                      # Navegação (sidebar, etc)
│
├── locales/                             # ✅ Traduções granulares
│   ├── pt/features/[section]/[page].json
│   ├── en/features/[section]/[page].json
│   ├── fr/features/[section]/[page].json
│   └── es/features/[section]/[page].json
│
└── routes/                              # ✅ Rotas usam API
    └── [page].tsx                      # Usa hooks da API diretamente
```

### **Exemplo de Uso:**

```typescript
// components/features/members/invite-members-card.tsx
import { useInviteMemberMutation } from "@/api/queries/member/use-invite-member-mutation";

export function InviteMembersCard() {
  const { t } = useTranslation("settings-members");

  // ✅ Usa hook da API diretamente
  const inviteMutation = useInviteMemberMutation();

  const form = useForm({ ... });

  const onSubmit = (values) => {
    inviteMutation.mutate(values);
  };

  return <Card>...</Card>;
}

// api/queries/member/use-invite-member-mutation.ts
import type { InviteMemberRequest } from "@/api/schemas/member.schema";
```

---

## 🎯 Dicas Importantes

### **Durante Implementação:**

✅ **Foco total** - Uma página por vez, não pule etapas
✅ **Testar sempre** - Não acumule páginas sem testar
✅ **Commit frequente** - Commit após cada página completa
✅ **Model Layer forte** - Separação clara de responsabilidades
✅ **Componentes simples** - Usam hooks do Model diretamente

### **Evitar:**

❌ Começar várias páginas ao mesmo tempo
❌ Pular testes
❌ Criar camadas intermediárias desnecessárias (ViewModels)
❌ Copiar/colar sem adaptar
❌ Commitar código quebrado

---

## 📚 Recursos de Apoio

- **CLAUDE.md** - Convenções do projeto
- **Member implementation** - Exemplo completo (src/models/, src/components/members/)

---

**Implementação Gradual - Arquitetura Simplificada ✅**

**Próxima página:** General Settings (2-3h)
