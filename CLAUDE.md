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

## AI Collaboration Guidelines

### 🤖 AI-Friendly Development Practices
This project is optimized for AI-assisted development. Follow these conventions:

### Development Workflow

1. **Analysis Phase**: First, think about the problem, read the codebase to find relevant files and create an internal plan
2. **Planning**: Use the TodoWrite tool internally to track tasks and check them off as completed
3. **Validation**: Before starting work, contact me and I'll check the plan
4. **Implementation**: Start working on tasks, checking them off as you progress
5. **Documentation**: At each step, give me a detailed explanation of changes made
6. **Simplicity**: Make each task and code change as simple as possible. We want to avoid massive or complex changes. Each change should impact the code as minimally as possible. Everything comes down to simplicity
7. **Review**: Provide a summary of changes made and any other relevant information

#### Anchor Comments
Use these prefixes for AI context:
- `// AIDEV-NOTE:` - Important context about code behavior
- `// AIDEV-TODO:` - Tasks for future AI sessions
- `// AIDEV-PATTERN:` - Established patterns to follow
- `// AIDEV-AVOID:` - Anti-patterns to avoid

#### AI Collaboration Modes
- **Playground Mode**: Experimental features in `src/playground/`
- **Pair Programming Mode**: Structured development with clear requirements
- **Production Mode**: Critical code requiring extra caution

#### Boundaries - AI Should NOT Touch
- Environment configuration files
- Security-related code

#### AI CAN Write
- Test files (`*.test.ts`, `*.spec.ts`) - Encouraged for comprehensive coverage
- Component tests and unit tests
- Integration tests for features
- Mock implementations for testing

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

### Directory Structure (SaaS Dashboard)

```
src/
├── routes/                    # Tanstack Router route definitions
│   ├── index.tsx             # Landing page (redirects to dashboard or login)
│   ├── __root.tsx            # Root layout with providers
│   ├── _authenticated.tsx    # Protected routes layout
│   ├── auth/                 # Public authentication routes
│   │   ├── login/
│   │   │   ├── index.tsx     # Login page
│   │   │   └── -login-form.tsx # Login form component
│   │   ├── register/
│   │   │   ├── index.tsx     # Registration page
│   │   │   └── -register-form.tsx
│   │   ├── verify-email/
│   │   │   ├── index.tsx     # Email verification page
│   │   │   └── -verify-email-form.tsx
│   │   ├── reset-password/   # Password reset request
│   │   └── renew-password/   # Password reset confirmation
│   └── _authenticated.dashboard/ # Protected dashboard routes
│       ├── _layout.tsx       # Dashboard layout with sidebar
│       ├── _layout/          # Main dashboard routes
│       │   ├── index.tsx     # Dashboard home
│       │   ├── chatbots.tsx  # Chatbots list
│       │   ├── knowledge-base.tsx # Knowledge base list
│       │   ├── usages.tsx    # Usage statistics
│       │   └── settings/     # Settings routes
│       │       ├── general.tsx   # General settings
│       │       ├── members.tsx   # Team members
│       │       ├── plans.tsx     # Subscription plans
│       │       ├── billing.tsx   # Billing info
│       │       └── security.tsx  # Security settings
│       ├── tenants/
│       │   └── create.tsx    # Create new tenant
│       ├── chatbots/
│       │   └── demo.tsx      # Chatbot demo/preview
│       └── knowledge-base/
│           └── create/       # Knowledge base creation wizard
│               ├── index.tsx     # Create overview
│               ├── files.tsx     # File upload
│               ├── websites.tsx  # Website sources
│               ├── text.tsx      # Text input
│               └── knowledge.tsx # Knowledge settings
├── components/               # Reusable UI components
│   ├── ui/                  # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   ├── dialog.tsx
│   │   ├── sidebar.tsx
│   │   └── ...              # Other shadcn components
│   ├── forms/               # Form components (React Hook Form)
│   ├── navigation/          # Navigation components
│   │   ├── app-sidebar.tsx      # Main application sidebar
│   │   ├── nav-main.tsx         # Main navigation links
│   │   ├── nav-user.tsx         # User dropdown menu
│   │   ├── nav-projects.tsx     # Project switcher
│   │   ├── team-switcher.tsx    # Tenant/team switcher
│   │   ├── breadcrumb-switcher.tsx # Breadcrumb navigation
│   │   └── navigation-breadcrumb.tsx
│   ├── chatbot/             # Chatbot-related components
│   │   ├── chatbot-creation-sidebar.tsx
│   │   ├── sources-sidebar.tsx
│   │   └── content/         # Chatbot content sections
│   │       ├── playground-content.tsx
│   │       ├── sources-content.tsx
│   │       ├── settings-content.tsx
│   │       └── widget-content.tsx
│   ├── knowledge/           # Knowledge base components
│   │   ├── knowledge-source-creator.tsx
│   │   ├── settings/        # Knowledge base settings
│   │   │   ├── general-settings-content.tsx
│   │   │   ├── ai-settings-content.tsx
│   │   │   ├── chat-interface-settings-content.tsx
│   │   │   └── security-settings-content.tsx
│   │   └── sources/         # Knowledge source types
│   │       ├── index-content.tsx
│   │       ├── files-content.tsx
│   │       ├── files-sources-content.tsx
│   │       ├── text-content.tsx
│   │       ├── websites-content.tsx
│   │       ├── websites-sources-content.tsx
│   │       └── knowledge-content.tsx
│   ├── layout/              # Layout components
│   │   └── subdomain-redirect.tsx # Subdomain routing handler
│   ├── layouts/             # Page layouts
│   │   ├── auth-layout.tsx       # Authentication pages layout
│   │   ├── creation-layout.tsx   # Creation wizard layout
│   │   ├── knowledge-creation-layout.tsx
│   │   └── chatbot-sources-layout.tsx
│   ├── modals/              # Modal dialogs
│   │   └── join-tenant-modal.tsx
│   ├── shared/              # Shared components
│   │   └── sources-list.tsx
│   ├── dashboard/           # Dashboard-specific components
│   └── skeletons/           # Loading skeleton components
├── hooks/                   # Custom React hooks (with Tanstack Query)
│   ├── use-auth.ts          # Authentication hook
│   ├── use-chatbots.ts      # Chatbot queries & mutations
│   ├── use-tenants.ts       # Tenant management
│   ├── use-current-tenant.ts # Current tenant context
│   ├── use-subscription.ts  # Subscription management
│   ├── use-plans.ts         # Subscription plans
│   ├── use-users.ts         # User management
│   ├── use-subdomain.ts     # Subdomain utilities
│   └── use-mobile.ts        # Mobile detection
├── auth/                    # Authentication utilities
│   ├── cookie.ts            # Cookie management
│   ├── jwt.ts               # JWT token utilities
│   ├── storage.ts           # Local/session storage for auth
│   ├── events.ts            # Auth event handling
│   ├── tenant.ts            # Tenant context for auth
│   └── types.ts             # Auth type definitions
├── lib/                     # Core utilities and configuration
│   ├── axios.ts             # Axios client configuration
│   ├── api-with-tenant.ts   # Multi-tenant API client
│   ├── query-client.ts      # Tanstack Query client config
│   ├── react-query-provider.tsx # Query provider component
│   ├── i18n.ts              # i18next configuration
│   ├── env.ts               # Environment variables
│   ├── url-utils.ts         # URL utilities
│   └── schemas/             # Shared Zod schemas
│       ├── auth/
│       │   └── index.ts     # Auth schemas
│       └── users/
│           └── index.ts     # User schemas
├── schemas/                 # Additional Zod schemas
│   └── auth.ts              # Authentication schemas
├── utils/                   # Utility functions
│   └── cn.ts                # cn() utility for class merging
├── locales/                 # Translation files (i18next)
│   ├── pt/                  # Portuguese (primary)
│   │   ├── common.json
│   │   ├── dashboard.json
│   │   └── auth.json
│   ├── en/                  # English
│   │   ├── common.json
│   │   ├── dashboard.json
│   │   └── auth.json
│   ├── fr/                  # French
│   │   ├── common.json
│   │   ├── dashboard.json
│   │   └── auth.json
│   └── es/                  # Spanish
│       └── auth.json        # Partial translation
└── assets/                  # Static assets
    ├── images/
    └── icons/
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

**CRITICAL: ALWAYS use `@/` alias for ALL internal imports. NEVER use `src/` or relative paths.**

The project uses `@/` alias for clean imports pointing to the `src/` directory:

```typescript
// ✅ CORRECT - Always use @ alias:
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"
import { useChatbots } from "@/hooks/use-chatbots"
import { ChatbotCard } from "@/components/chatbot/chatbot-card"
import { apiWithTenant } from "@/lib/api-with-tenant"

// ❌ WRONG - Never use these:
import { Button } from "src/components/ui/button"        // Never use src/
import { Button } from "../../../components/ui/button"  // Never use relative paths
import { Button } from "./components/ui/button"         // Never use relative paths
```

**IMPORTANT**: When you see imports using `src/` instead of `@/`, immediately correct them. This is a critical convention for the project.

### Backend Integration

#### API Architecture
- **Backend**: Isolated multi-tenant API (RAGFlow backend integration)
- **Authentication**: JWT-based auth with refresh tokens
- **Data**: RESTful API for chatbots, analytics, and user management
- **File Upload**: Support for training data and document uploads
- **Chat**: HTTP requests to our API (which internally uses RAGFlow)


#### Swagger Integration
- Types will be auto-generated from OpenAPI/Swagger specification
- API client methods will be generated based on backend endpoints
- Zod schemas will be created for request/response validation
- Real-time type safety between frontend and backend

#### Multi-tenant Architecture
- **Subdomain Routing**: Each tenant has their own subdomain (e.g., `acme.saasbot.com`)
- **Tenant Context**: Automatically extracted from subdomain and passed to API calls
- **Isolated Data**: Each tenant's data is completely isolated
- **Auth Management**: JWT tokens include tenant context for authorization
- **Cookie-based Sessions**: Secure cookie management for authentication state

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

#### Route Definitions
- Use file-based routing in `src/routes/`
- Follow Tanstack Router conventions for route files
- Use `__root.tsx` for root layout
- Use `index.tsx` for index routes
- Use `$param.tsx` for dynamic routes
- Use `_layout.tsx` for layout routes

#### Route Structure Examples
```typescript
// src/routes/__root.tsx - Root layout
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
})

// src/routes/index.tsx - Homepage
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <div>Hello World!</div>,
})

// src/routes/posts/$postId.tsx - Dynamic route
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  component: () => {
    const { postId } = Route.useParams()
    return <div>Post {postId}</div>
  },
})
```

#### Router Best Practices
- Use type-safe route params with Zod validation
- Implement proper error boundaries for routes
- Use route loaders for data fetching when needed
- Leverage route-level code splitting
- Follow consistent naming for route files

### Tanstack Query Patterns

#### Data Fetching with Tanstack Query
- Create custom hooks in `src/hooks/` (e.g., `use-chatbots.ts`, `use-auth.ts`)
- Hooks combine both queries and mutations for each domain
- Use Zod schemas for API response validation
- Implement proper error handling and loading states
- Leverage query keys for efficient caching
- Use multi-tenant API client (`apiWithTenant`) for authenticated requests

#### Query Hook Examples
```typescript
// src/hooks/use-chatbots.ts
import { useQuery, useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { apiWithTenant } from '@/lib/api-with-tenant'

const ChatbotSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'inactive', 'draft']),
  messageCount: z.number(),
  storageUsed: z.number(),
})

type Chatbot = z.infer<typeof ChatbotSchema>

export function useChatbots() {
  return useQuery({
    queryKey: ['chatbots'],
    queryFn: async (): Promise<Chatbot[]> => {
      const response = await fetch('/api/chatbots')
      const data = await response.json()
      return z.array(ChatbotSchema).parse(data)
    },
  })
}

export function useChatbot(id: string) {
  return useQuery({
    queryKey: ['chatbots', id],
    queryFn: async (): Promise<Chatbot> => {
      const response = await fetch(`/api/chatbots/${id}`)
      const data = await response.json()
      return ChatbotSchema.parse(data)
    },
    enabled: !!id,
  })
}

export function useCreateChatbot() {
  return useMutation({
    mutationFn: async (data: CreateChatbotData) => {
      const response = await fetch('/api/chatbots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbots'] })
    },
  })
}
```

#### Query & Mutation Best Practices
- Use descriptive query keys with hierarchical structure
- Write API endpoints directly in fetch calls (no constants needed)
- Group related queries and mutations in the same file by domain
- Implement optimistic updates for mutations
- Invalidate queries after successful mutations
- Use React Query DevTools in development
- Implement proper stale time and cache time strategies
- Use suspense boundaries for better UX

### Form Patterns (React Hook Form + Zod)

#### Form Structure
- Use React Hook Form for performant form handling
- Integrate with Zod for schema validation
- Leverage shadcn/ui Form components for consistent UI
- Use @hookform/resolvers/zod for seamless integration

#### Form Examples
```typescript
// src/components/forms/UserForm.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const userFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  age: z.number().min(18, "Idade mínima é 18 anos"),
})

type UserFormData = z.infer<typeof userFormSchema>

export function UserForm() {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      age: 18,
    },
  })

  function onSubmit(data: UserFormData) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  )
}
```

#### Form Best Practices
- Always use Zod schemas for form validation
- Leverage React Hook Form's performance optimizations
- Use shadcn/ui Form components for consistent styling
- Implement proper error handling and loading states
- Use controlled components sparingly, prefer uncontrolled
- Implement form submission with Tanstack Query mutations

### Internationalization Patterns (react-i18next)

#### Translation Structure
- Organize translations by feature/namespace in `src/locales/`
- Use JSON files for translation keys organized by context
- **Namespaces explained**:
  - `common.json`: Traduções reutilizadas em todo o app (botões, ações, termos gerais)
  - `dashboard.json`: Traduções específicas da dashboard (chatbots, analytics, settings)
  - `auth.json`: Traduções de autenticação (login, registro, etc.)
- Implement namespace-based organization for better maintainability
- Support browser language detection with fallback to English

#### i18next Configuration Example
```typescript
// src/lib/i18n.ts
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// Translation imports
import enAuth from '@/locales/en/auth.json'
import enCommon from '@/locales/en/common.json'
import enDashboard from '@/locales/en/dashboard.json'
import esAuth from '@/locales/es/auth.json'
import frAuth from '@/locales/fr/auth.json'
import frCommon from '@/locales/fr/common.json'
import frDashboard from '@/locales/fr/dashboard.json'
import ptAuth from '@/locales/pt/auth.json'
import ptCommon from '@/locales/pt/common.json'
import ptDashboard from '@/locales/pt/dashboard.json'

const resources = {
  en: {
    auth: enAuth,
    common: enCommon,
    dashboard: enDashboard,
  },
  es: {
    auth: esAuth,
    common: enCommon,      // Fallback to English
    dashboard: enDashboard, // Fallback to English
  },
  fr: {
    auth: frAuth,
    common: frCommon,
    dashboard: frDashboard,
  },
  pt: {
    auth: ptAuth,
    common: ptCommon,
    dashboard: ptDashboard,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // default language (Portuguese)
    fallbackLng: 'en',
    detection: {
      order: ['navigator', 'localStorage'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      convertDetectedLanguage: (lng: string) => {
        // Extract only the language part (before the dash)
        return lng.split('-')[0]
      },
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    ns: ['auth', 'common', 'dashboard'],
    defaultNS: 'auth',
    supportedLngs: ['en', 'es', 'fr', 'pt'],
    cleanCode: true,
    load: 'languageOnly', // Load only language code (fr, en) not region (fr-FR, en-US)
  })

export default i18n
```

#### Translation Usage Examples
```typescript
// Basic usage
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t, i18n } = useTranslation()
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </div>
  )
}

// Namespace usage
function LoginPage() {
  const { t } = useTranslation('auth')

  return (
    <form>
      <h1>{t('login.title')}</h1>
      <label>{t('login.email')}</label>
      <input placeholder={t('login.emailPlaceholder')} />
    </form>
  )
}

// Interpolation
function WelcomeMessage({ userName }: { userName: string }) {
  const { t } = useTranslation()
  
  return <p>{t('welcome_user', { name: userName })}</p>
}
```

#### Translation File Examples
```json
// src/locales/pt/common.json - Traduções gerais reutilizáveis
{
  "welcome": "Bem-vindo",
  "welcome_user": "Bem-vindo, {{name}}!",
  "actions": {
    "save": "Salvar",
    "cancel": "Cancelar",
    "delete": "Excluir",
    "edit": "Editar",
    "create": "Criar",
    "back": "Voltar",
    "next": "Próximo"
  },
  "navigation": {
    "home": "Início",
    "dashboard": "Dashboard",
    "settings": "Configurações",
    "chatbots": "Chatbots",
    "knowledgeBase": "Base de Conhecimento"
  },
  "status": {
    "loading": "Carregando...",
    "error": "Erro",
    "success": "Sucesso",
    "pending": "Pendente"
  }
}

// src/locales/pt/dashboard.json - Dashboard-specific translations
{
  "chatbots": {
    "title": "Meus Chatbots",
    "create": "Criar Chatbot",
    "empty": "Nenhum chatbot encontrado",
    "settings": {
      "general": "Geral",
      "ai": "IA",
      "interface": "Interface",
      "security": "Segurança"
    }
  },
  "knowledgeBase": {
    "title": "Base de Conhecimento",
    "sources": "Fontes",
    "files": "Arquivos",
    "websites": "Sites",
    "text": "Texto"
  },
  "settings": {
    "general": "Configurações Gerais",
    "members": "Membros da Equipe",
    "plans": "Planos",
    "billing": "Faturamento",
    "security": "Segurança"
  }
}

// src/locales/pt/auth.json - Authentication translations
{
  "login": {
    "title": "Entrar",
    "email": "Email",
    "emailPlaceholder": "seu@email.com",
    "password": "Senha",
    "passwordPlaceholder": "Digite sua senha",
    "submit": "Entrar",
    "forgotPassword": "Esqueceu a senha?",
    "noAccount": "Não tem uma conta?"
  },
  "register": {
    "title": "Criar Conta",
    "name": "Nome",
    "confirmPassword": "Confirmar Senha",
    "submit": "Registrar",
    "hasAccount": "Já tem uma conta?"
  },
  "verifyEmail": {
    "title": "Verificar Email",
    "description": "Enviamos um código para seu email"
  },
  "validation": {
    "required": "Este campo é obrigatório",
    "email": "Email inválido",
    "minLength": "Mínimo de {{count}} caracteres",
    "passwordMatch": "As senhas não coincidem"
  }
}
```

#### i18n Best Practices
- Use descriptive, hierarchical keys (`auth.login.title`, `dashboard.chatbots.create`)
- Keep translations close to components when possible
- Implement type-safe translation keys using TypeScript
- Use interpolation for dynamic content (e.g., `{{name}}`, `{{count}}`)
- Provide fallback values for missing translations (English is fallback)
- Test all language variations
- Use namespaces to organize translations by feature (auth, common, dashboard)
- Spanish (es) currently has partial translations with English fallbacks

### Component Patterns

#### shadcn/ui Component Usage
- Use `cn()` utility for merging Tailwind classes (located in `@/utils/cn`)
- Follow shadcn/ui patterns for component composition
- Place UI components in `src/components/ui/`
- Use Zod schemas for form validation and data types
- Leverage class-variance-authority for component variants

Example:
```tsx
import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"

export function CustomButton({ className, ...props }) {
  return (
    <Button
      className={cn("custom-styles", className)}
      {...props}
    />
  )
}
```

### File Organization
- Each component should have its own folder if it includes multiple files
- Co-locate related files (component + tests + stories if applicable)
- Use index files for clean imports
- Separate business logic from UI components
- All styling done via Tailwind classes - no separate CSS/SCSS files

#### Testing Organization
- **Unit tests**: Co-locate with components (`Component.test.tsx`)
- **Hook tests**: Next to custom hooks (`useAuth.test.ts`)
- **Utility tests**: Next to utility functions (`utils.test.ts`)
- **E2E tests**: In `cypress/e2e/` directory (only where necessary)
- **Test naming**: Use `.test.ts` for Vitest, `.cy.ts` for Cypress

#### Interface and Type Organization
- Interfaces and types should be defined in their respective files where they're used
- No separate `types/` folder - co-locate types with implementation
- Use Zod schemas for runtime validation and infer TypeScript types
- Shared schemas live in `src/lib/schemas/` or `src/schemas/`
- Co-locate API response schemas with their respective hooks
- Example structure:
  ```typescript
  // src/hooks/use-chatbots.ts
  const ChatbotSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(['active', 'inactive']),
  })
  type Chatbot = z.infer<typeof ChatbotSchema>

  // src/lib/schemas/auth/index.ts - Shared auth schemas
  export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  export type LoginRequest = z.infer<typeof LoginSchema>

  // src/schemas/auth.ts - Additional auth schemas
  export const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  })
  export type RegisterRequest = z.infer<typeof RegisterSchema>
  ```

## Git Conventions

### Commit Prefixes for AI Collaboration
- `[AI]` - Major changes made with AI assistance
- `[AI-minor]` - Minor changes or fixes with AI assistance
- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `docs:` - Documentation updates

## Development Notes

- HMR (Hot Module Replacement) is enabled for fast development
- The build process includes TypeScript compilation before bundling
- Tanstack Router is fully integrated with file-based routing
- Multi-tenant architecture with subdomain-based routing is implemented
- Authentication system with JWT and refresh tokens is in place
- i18next is configured with Portuguese as the default language
- All UI components use Tailwind CSS v4 with shadcn/ui components
- Vitest is configured for unit testing

## Error Handling Philosophy

- Use TypeScript's type system to prevent errors at compile time
- Implement proper error boundaries for React components
- Prefer explicit error handling over silent failures
- Log errors with sufficient context for debugging

## Performance Considerations

- Lazy load components and routes when possible
- Use React.memo for expensive components
- Implement proper code splitting
- Optimize bundle size with proper imports

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
