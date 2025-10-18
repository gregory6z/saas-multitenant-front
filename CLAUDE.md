# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MultiSaasWeb** is a modern SaaS dashboard for chatbot creation and management, similar to Chatbase. The application enables users to create, configure, and manage AI chatbots through an intuitive web interface.

### Key Features
- 🤖 **Chatbot Builder**: Visual chatbot creation and configuration
- 📊 **Analytics Dashboard**: Performance metrics and conversation analytics
- 👥 **Multi-tenant Architecture**: Isolated customer environments with subdomain-based routing
- 💬 **RAGFlow Integration**: Advanced retrieval-augmented generation backend
- 🌐 **Multi-language Support**: Portuguese (primary), English, French, Spanish
- 🎨 **Modern UI**: Inspired by Chatbase with contemporary design patterns

## Development Workflow

1. **Analysis**: Read codebase, identify relevant files, create internal plan
2. **Planning**: Use TodoWrite tool to track tasks
3. **Validation**: Present plan for approval before starting
4. **Implementation**: Work on tasks, check them off as you progress
5. **Documentation**: Explain changes at each step
6. **Simplicity**: Minimal, simple changes - avoid massive or complex modifications
7. **Review**: Summary of changes and relevant information

## Package Manager

This project uses **pnpm** as the package manager. Make sure pnpm is installed globally:
```bash
npm install -g pnpm
```

## Development Commands

- **Start development server**: `pnpm dev` - Starts Vite development server with hot module replacement
- **Build for production**: `pnpm build` - Runs TypeScript compilation followed by Vite build
- **Lint code**: `pnpm lint` - Runs Biome check on the codebase
- **Fix linting issues**: `pnpm lint:fix` - Auto-fix Biome linting issues
- **Format code**: `pnpm format` - Format code with Biome
- **Type checking**: `pnpm typecheck` - Run TypeScript compiler checks without emitting files
- **Check all**: `pnpm check-all` - Run both typecheck and lint
- **Preview production build**: `pnpm preview` - Serves the production build locally
- **Clean build**: `pnpm clean` - Remove dist and cache directories
- **Dev with network access**: `pnpm dev:host` - Start dev server accessible from network
- **Analyze bundle**: `pnpm build:analyze` - Build and analyze bundle size

### Testing Commands

- **Run unit tests**: `pnpm test` - Run Vitest unit tests
- **Run tests in watch mode**: `pnpm test:watch` - Run Vitest in watch mode
- **Run E2E tests**: `pnpm test:e2e` - Run Cypress E2E tests
- **Open Cypress**: `pnpm cypress:open` - Open Cypress test runner
- **Test coverage**: `pnpm test:coverage` - Generate test coverage report

### shadcn/ui Commands

- **Add component**: `pnpm dlx shadcn@latest add [component-name]` - Install shadcn/ui components
- **Add multiple components**: `pnpm dlx shadcn@latest add button input form` - Install multiple components
- **Update components**: `pnpm dlx shadcn@latest update` - Update existing components

## Project Architecture

This is a React + TypeScript + Vite SaaS dashboard application for chatbot management:

- **Build Tool**: Vite with React plugin for fast development and HMR
- **Language**: TypeScript with strict configuration
- **Framework**: React 19.1.0 with modern features
- **Router**: Tanstack Router for type-safe file-based routing
- **Data Fetching**: Tanstack Query for server state management
- **Forms**: React Hook Form with Zod validation for performant forms
- **Internationalization**: react-i18next for translations and localization
- **Styling**: Tailwind CSS v4 + shadcn/ui for component library
- **Schema Validation**: Zod for TypeScript-first schema validation
- **Testing**: Vitest for unit tests, Cypress for E2E tests where necessary
- **Linting & Formatting**: Biome for fast linting, formatting, and import organization

### Directory Structure

```
src/
├── routes/                         # Tanstack Router file-based routing
│   ├── __root.tsx, index.tsx
│   ├── _authenticated.tsx          # Protected routes wrapper
│   ├── auth/                       # login, register, verify-email, reset-password
│   └── _authenticated.dashboard/  # Protected dashboard
│       ├── _layout/ (index, chatbots, knowledge-base, usages, settings/)
│       ├── tenants/, chatbots/, knowledge-base/
├── api/                            # ✅ API Layer (NEW)
│   ├── schemas/                    # Zod schemas with exported types
│   │   └── [entity].schema.ts     # e.g., member.schema.ts
│   ├── client/                     # HTTP clients (axios)
│   │   └── [entity].api.ts        # e.g., member.api.ts
│   └── queries/[entity]/           # Tanstack Query hooks
│       ├── use-[entity]-query.ts
│       └── use-[action]-mutation.ts
├── components/
│   ├── ui/                         # shadcn/ui components (button, input, form, etc.)
│   ├── features/                   # ✅ Feature-based organization (NEW)
│   │   ├── tenants/                # Tenant management feature
│   │   │   ├── forms/              # Forms for tenant pages (create, edit, etc.)
│   │   │   └── [component].tsx     # Other tenant components
│   │   ├── settings/               # Settings feature
│   │   │   ├── dialogs/            # Dialogs used in settings pages
│   │   │   └── [component].tsx     # Other settings components
│   │   └── [feature]/              # Other features (chatbots, knowledge-base, etc.)
│   │       ├── forms/              # Feature forms (for main pages)
│   │       ├── dialogs/            # Feature dialogs (for settings/config)
│   │       └── [component].tsx     # Feature components
│   ├── shared/                     # Reusable components (future)
│   ├── navigation/                 # app-sidebar, nav-*, team-switcher
│   ├── layouts/                    # Page layouts (auth, creation wizards)
│   └── skeletons/                  # Loading states
├── hooks/                          # Legacy hooks (migrating to api/)
│   └── use-auth, use-chatbots, use-tenants, use-subscription, etc.
├── auth/                           # Auth utilities (cookie, jwt, storage, tenant)
├── lib/                            # Core config (axios, i18n, query-client, schemas)
├── schemas/                        # Shared Zod schemas
├── utils/                          # Utilities (cn)
├── locales/                        # i18next translations (pt, en, fr, es)
│   └── [lang]/features/[section]/[page].json  # Granular translations
└── assets/
```

### Key Configuration Files

- `components.json`: shadcn/ui configuration with @ alias mapping
- `tailwind.config.js`: Tailwind CSS v4 configuration
- `tsr.config.json`: Tanstack Router CLI configuration
- `src/utils/cn.ts`: cn() utility for merging Tailwind classes (clsx + tailwind-merge)
- `src/lib/axios.ts`: Axios client configuration with interceptors
- `src/lib/api-with-tenant.ts`: Multi-tenant API client with subdomain support
- `src/lib/query-client.ts`: Tanstack Query client configuration
- `src/lib/i18n.ts`: i18next configuration with namespaces
- `vite.config.ts`: Vite configuration with React plugin and path mapping (@)
- `vitest.config.ts`: Vitest configuration for unit testing
- `tsconfig.json`: Root TypeScript configuration with project references
- `tsconfig.app.json`: App-specific TypeScript configuration with strict settings and @ path
- `tsconfig.node.json`: Node.js-specific TypeScript configuration
- `biome.json`: Biome configuration for linting, formatting, and code quality

### Path Mapping Configuration

**CRITICAL: ALWAYS use `@/` alias. NEVER use `src/` or relative paths.**

```typescript
// ✅ CORRECT
import { Button } from "@/components/ui/button"
import { useChatbots } from "@/hooks/use-chatbots"

// ❌ WRONG
import { Button } from "src/components/ui/button"
import { Button } from "../../../components/ui/button"
```

### Backend Integration

// AIDEV-NOTE: Multi-tenant API with RAGFlow backend, subdomain-based tenant routing
// Reference: `src/lib/axios.ts`, `src/lib/api-with-tenant.ts`

**Architecture:**
- Multi-tenant RESTful API (RAGFlow integration)
- JWT auth with refresh tokens (httpOnly cookies)
- Subdomain routing: `acme.saasbot.com` → tenant `acme`
- Tenant context auto-extracted from subdomain
- Complete data isolation per tenant

**Future: Swagger Integration**
- Auto-generated types from OpenAPI spec
- Zod schemas for request/response validation
- Type-safe API client methods

## Code Conventions

### TypeScript Configuration
The project uses strict TypeScript settings including:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedSideEffectImports: true`

### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **shadcn/ui Components**: kebab-case in `src/components/ui/` (`button.tsx`, `input.tsx`)
- **Form Components**: PascalCase with "Form" suffix in `src/components/forms/` (`UserForm.tsx`)
- **Form Schemas**: camelCase with "Schema" suffix (`userFormSchema`)
- **Hooks**: camelCase with "use" prefix (`useUserData.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`UserData.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)

### Tanstack Router Patterns

**File Conventions:** `__root.tsx` (root), `index.tsx` (index), `$param.tsx` (dynamic), `_layout.tsx` (layout), `_authenticated.tsx` (protected)

**Rules:**
- Type-safe params: `const { postId } = Route.useParams()`
- Zod validation for params, error boundaries, route loaders
- Code splitting at route level

### Tanstack Query Patterns

// AIDEV-PATTERN: Custom hooks in `src/hooks/` combining queries + mutations per domain
// Reference: `src/hooks/use-chatbots.ts`, `src/hooks/use-auth.ts`, `src/hooks/use-tenants.ts`

**Structure:** Define Zod schema → `useQuery` for fetching → `useMutation` for actions
```typescript
const ResourceSchema = z.object({ id: z.string(), name: z.string() })

export function useResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data } = await apiWithTenant.get('/resources')
      return z.array(ResourceSchema).parse(data)
    },
  })
}
```

**Rules:**
- Hierarchical query keys: `['chatbots']`, `['chatbots', id]`
- Zod validation on responses, use `apiWithTenant`
- Invalidate queries after mutations: `queryClient.invalidateQueries({ queryKey: ['resources'] })`

### Form Patterns (React Hook Form + Zod)

// AIDEV-PATTERN: React Hook Form + Zod + shadcn/ui Form components
// Reference: `src/components/forms/create-tenant-form.tsx`, `src/routes/auth/login/-login-form.tsx`

**Structure:**
```typescript
const { t } = useTranslation()

const formSchema = z.object({
  email: z.string().email(t('validation.email')),
  name: z.string().min(2, t('validation.minLength', { count: 2 })),
})

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: { email: "", name: "" },
})

const mutation = useCreateResource()
```

**Rules:**
- Zod schema → use `t()` for validation messages (i18n)
- Use `@hookform/resolvers/zod` for integration
- Submit with Tanstack Query mutations
- Prefer uncontrolled components (React Hook Form default)

#### Zod Schemas with i18n (CRITICAL)

**RULE: Schemas used in React Hook Form MUST be factory functions accepting `t()` for i18n validation messages.**

**✅ CORRECT Pattern:**
```typescript
// src/api/schemas/tenant.schema.ts
import type { TFunction } from "i18next";
import { z } from "zod";

// Factory function for form schemas - REQUIRED for schemas used in React Hook Form
export const createTenantRequestSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t("errors.nameRequired")),
    subdomain: z
      .string()
      .min(3, t("errors.subdomainMinLength"))
      .max(63, t("errors.subdomainMaxLength")),
  });

// Type export using ReturnType
export type CreateTenantRequest = z.infer<ReturnType<typeof createTenantRequestSchema>>;

// Constant schema for Response validation - NO i18n needed
export const CreateTenantResponseSchema = z.object({
  tenant: TenantSchema,
});
```

**Usage in Form:**
```typescript
// src/components/forms/create-tenant-form.tsx
const { t } = useTranslation("tenants-create");
const formSchema = createTenantRequestSchema(t); // Instantiate with t()

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: { name: "", subdomain: "" },
});
```

**Usage in Mutation Hook:**
```typescript
// src/api/queries/tenant/use-create-tenant-mutation.ts
export function useCreateTenantMutation() {
  return useMutation({
    mutationFn: async (data: CreateTenantRequest) => {
      // Validation already done in form - just pass data through
      const response = await createTenant(data);
      return CreateTenantResponseSchema.parse(response).tenant;
    },
  });
}
```

**When to Use Factory Functions:**
- ✅ **Request schemas used in React Hook Form** → Factory function with `t()`
- ❌ **Response schemas** → Constant schema (no i18n)
- ❌ **Schemas only used in mutation hooks** → Constant schema (hardcoded messages)

**Schema File Organization:**
```typescript
// 1. BASE SCHEMAS (used by other schemas)
export const TenantSchema = z.object({...})

// 2. REQUEST SCHEMAS (factory functions for forms)
export const createTenantRequestSchema = (t: TFunction) => z.object({...})
export const updateTenantRequestSchema = (t: TFunction) => z.object({...})

// 3. RESPONSE SCHEMAS (constant schemas - no i18n needed)
export const CreateTenantResponseSchema = z.object({...})
export const UpdateTenantResponseSchema = z.object({...})

// 4. TYPES (at the end)
export type CreateTenantRequest = z.infer<ReturnType<typeof createTenantRequestSchema>>
export type CreateTenantResponse = z.infer<typeof CreateTenantResponseSchema>
```

### Internationalization (react-i18next)

// AIDEV-PATTERN: i18next with namespace-based translations
// Reference: `src/lib/i18n.ts` (full config), `src/locales/{pt,en,fr,es}/`

**Development Priority:** Develop everything in Portuguese first, other languages later.

**File Organization:** Each page/screen has its own JSON file (e.g., `settings.json` for settings pages)
**Namespaces:** `common.json` (shared/reusable), `auth.json` (authentication), `dashboard.json` (dashboard), `settings.json` (settings pages)
**Languages:** pt (primary - develop here first), en/fr/es (translate later)

**Usage:** `const { t } = useTranslation('settings')` → `t('members.title')` → `t('members.inviteNew')`

**Rules:**
- **One JSON file per page/screen** for easier maintenance
- Hierarchical keys: `members.roles.admin`, `general.workspaceName`
- Use `t()` in Zod schemas for validation messages
- Interpolation with `{{variable}}`
- **IMPORTANT**: Add all new keys to `pt/` first, translate to other languages later
- Register new namespaces in `src/lib/i18n.ts` (imports + resources + ns array)

### Component Patterns

#### shadcn/ui Component Usage
- Use `cn()` utility (`@/utils/cn`) for merging Tailwind classes
- UI components in `src/components/ui/`, use Zod for validation
- Example: `<Button className={cn("custom-styles", className)} {...props} />`

#### Modal/Dialog Component Patterns

// AIDEV-PATTERN: Call mutation/query hooks directly inside modals, not via parent callbacks
// Reference: `src/components/modals/remove-member-modal.tsx`, `src/components/modals/delete-tenant-modal.tsx`

**✅ PREFER: Hook inside modal**
```tsx
export function RemoveMemberModal({ memberId, memberName, onOpenChange }) {
  const removeMember = useRemoveMember() // ✅ Hook in modal

  return (
    <AlertDialog>
      <AlertDialogAction
        onClick={() => removeMember.mutate(memberId, { onSuccess: () => onOpenChange(false) })}
        disabled={removeMember.isPending}
      >
        {removeMember.isPending ? "Removing..." : "Remove"}
      </AlertDialogAction>
    </AlertDialog>
  )
}
```

**❌ AVOID: Callbacks from parent**
```tsx
interface Props {
  onConfirm: () => void  // ❌ Don't pass mutation callbacks
  isLoading: boolean     // ❌ Don't pass loading states
}
```

### File Organization

#### Feature-based Component Organization (CRITICAL)

**RULE: Components organized by page/feature, with `forms/` for main pages and `dialogs/` for settings pages.**

**Organization Pattern:**
```
src/components/features/
├── tenants/              # Tenant management feature
│   ├── forms/            # Forms for tenant PAGES (create, edit tenant pages)
│   │   └── create-tenant-form.tsx
│   └── [component].tsx   # Other tenant components
├── settings/             # Settings feature
│   ├── dialogs/          # Dialogs used in SETTINGS pages
│   │   └── join-tenant-dialog.tsx
│   └── [component].tsx   # Other settings components
└── [feature]/            # Other features (chatbots, knowledge-base, etc.)
    ├── forms/            # Feature forms (for main feature pages)
    ├── dialogs/          # Feature dialogs (for settings/config modals)
    └── [component].tsx   # Feature components
```

**Rules:**
- **Forms** → Full-page forms for main feature pages (e.g., create tenant page)
- **Dialogs** → Modal dialogs for settings and secondary actions (e.g., join tenant from switcher)
- Use terminology: "Dialog" for modal wrappers with `<Dialog>` component
- Use terminology: "Form" for form components with React Hook Form
- A Dialog component can contain a Form component inside it

**Examples:**
- ✅ `features/tenants/forms/create-tenant-form.tsx` → Full page form
- ✅ `features/settings/dialogs/join-tenant-dialog.tsx` → Modal dialog with form inside
- ❌ `forms/create-tenant-form.tsx` → Don't use isolated `forms/` folder
- ❌ `modals/join-tenant-modal.tsx` → Don't use isolated `modals/` folder or "Modal" terminology

**General File Organization:**
- Co-locate: components, tests, related files together
- Index files for clean imports
- Separate business logic from UI
- Tailwind only (no CSS/SCSS files)

**Testing:**
- Co-locate tests: `Component.test.tsx`, `useAuth.test.ts`
- E2E tests: `cypress/e2e/` (only where necessary)
- Naming: `.test.ts` (Vitest), `.cy.ts` (Cypress)

#### Interface and Type Organization

// AIDEV-PATTERN: Co-locate types with implementation, use Zod schemas for runtime validation
// Reference: `src/hooks/use-chatbots.ts`, `src/lib/schemas/auth/index.ts`

**Rules:**
- Co-locate types with implementation (no separate `types/` folder)
- Use Zod schemas → infer TypeScript types with `z.infer<typeof Schema>`
- API response schemas live in hooks (`src/hooks/use-*.ts`)
- Shared schemas in `src/lib/schemas/` or `src/schemas/`

**Example:** `const ChatbotSchema = z.object({ id: z.string() })` → `type Chatbot = z.infer<typeof ChatbotSchema>`

## Development Notes

- HMR enabled, TypeScript compilation before bundling
- File-based routing (Tanstack Router), multi-tenant subdomain architecture
- JWT auth with refresh tokens, Portuguese default (i18next)
- Tailwind CSS v4 + shadcn/ui, Vitest for unit testing

## Error Handling & Performance

**Error Handling:**
- TypeScript for compile-time safety
- React error boundaries
- Explicit error handling (no silent failures)

**Performance:**
- Lazy load components/routes
- React.memo for expensive components
- Code splitting, optimize imports
