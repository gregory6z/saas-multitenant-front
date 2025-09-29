# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MultiSaasWeb** is a modern SaaS dashboard for chatbot creation and management, similar to Chatbase. The application enables users to create, configure, and manage AI chatbots through an intuitive web interface.

### Key Features
- 🤖 **Chatbot Builder**: Visual chatbot creation and configuration
- 📊 **Analytics Dashboard**: Performance metrics and conversation analytics  
- 👥 **Multi-tenant Architecture**: Isolated customer environments
- 💬 **RAGFlow Integration**: Advanced retrieval-augmented generation backend
- 🌐 **Multi-language Support**: French/English (primary), Portuguese
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
├── routes/           # Tanstack Router route definitions
│   ├── index.tsx    # Landing/Login page
│   ├── dashboard/   # Dashboard routes
│   │   ├── index.tsx        # Dashboard overview
│   │   ├── chatbots/        # Chatbot management
│   │   │   ├── index.tsx    # Chatbots list
│   │   │   ├── create.tsx   # Create chatbot
│   │   │   └── $id/         # Individual chatbot
│   │   │       ├── index.tsx    # Chatbot details
│   │   │       ├── analytics.tsx # Analytics
│   │   │       ├── settings.tsx  # Configuration
│   │   │       └── training.tsx  # Training data
│   │   ├── analytics/       # Global analytics
│   │   └── settings/        # Account settings
│   ├── auth/        # Authentication routes
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── __root.tsx   # Root layout
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── forms/       # Form components (React Hook Form)
│   ├── dashboard/   # Dashboard-specific components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── stats-card.tsx
│   │   └── chatbot-card.tsx
│   ├── chatbot/     # Chatbot-related components
│   │   ├── source-uploader.tsx
│   │   ├── chat-preview.tsx
│   │   ├── training-upload.tsx
│   │   └── embed-code-modal.tsx
│   ├── playground/  # Testing interface components
│   │   ├── playground-chat.tsx
│   │   ├── model-settings.tsx
│   │   └── source-citations.tsx
│   └── analytics/   # Analytics components
│       ├── metrics-chart.tsx
│       ├── conversation-table.tsx
│       └── usage-metrics.tsx
├── lib/             # Utility functions
│   ├── utils.ts     # cn() utility for class merging
│   ├── api.ts       # API client configuration
│   ├── auth.ts      # Authentication utilities
│   └── i18n.ts      # i18next configuration
├── hooks/           # Custom React hooks
│   ├── queries/     # Tanstack Query hooks (queries + mutations)
│   │   ├── chatbots.ts     # Chatbot queries & mutations
│   │   ├── analytics.ts    # Analytics queries
│   │   └── auth.ts         # Auth queries & mutations
│   └── use-auth.ts  # Authentication hook
├── locales/         # Translation files
│   ├── fr/          # French translations
│   │   ├── common.json
│   │   ├── dashboard.json
│   │   ├── chatbot.json
│   │   └── auth.json
│   ├── en/          # English translations
│   │   ├── common.json
│   │   ├── dashboard.json
│   │   ├── chatbot.json
│   │   └── auth.json
│   └── pt/          # Portuguese translations
│       ├── common.json
│       ├── dashboard.json
│       ├── chatbot.json
│       └── auth.json
├── services/        # API calls and external services
│   ├── chatbot.ts   # Chatbot API calls
│   ├── analytics.ts # Analytics API calls
│   └── auth.ts      # Authentication API calls
├── constants/       # Application constants
│   └── routes.ts    # Route constants
└── assets/          # Static assets
    ├── images/
    └── icons/
```

### Key Configuration Files

- `components.json`: shadcn/ui configuration
- `tailwind.config.js`: Tailwind CSS configuration with shadcn theme
- `src/lib/utils.ts`: Utility functions including cn() for class merging
- `src/lib/api.ts`: API client with axios/fetch configuration for backend
- `vite.config.ts`: Vite configuration with React plugin and path mapping (@)
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
import { cn } from "@/lib/utils"
import { useChatbots } from "@/hooks/queries/chatbots"
import { ChatbotCard } from "@/components/chatbot/chatbot-card"

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

### Current Source Structure

- `src/main.tsx`: Application entry point with React root mounting
- `src/App.tsx`: Main application component (currently the default Vite+React template)
- `src/index.css`: Global styles
- `src/App.css`: Component-specific styles
- `src/assets/`: Static assets like images

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
- Create custom hooks in `src/hooks/queries/`
- Use Zod schemas for API response validation
- Implement proper error handling and loading states
- Leverage query keys for efficient caching

#### Query Hook Examples
```typescript
// src/hooks/queries/useChatbots.ts
import { useQuery, useMutation } from '@tanstack/react-query'
import { z } from 'zod'

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
  - `forms.json`: Traduções específicas para formulários (labels, placeholders, erros)
  - `dashboard.json`: Traduções específicas da dashboard
  - `auth.json`: Traduções de autenticação (login, registro, etc.)
- Implement namespace-based organization for better maintainability
- Support lazy loading of translation bundles

#### i18next Configuration Example
```typescript
// src/lib/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation imports
import commonFr from '@/locales/fr/common.json'
import formsFr from '@/locales/fr/forms.json'
import commonEn from '@/locales/en/common.json'
import formsEn from '@/locales/en/forms.json'
import commonPt from '@/locales/pt/common.json'
import formsPt from '@/locales/pt/forms.json'

const resources = {
  fr: {
    common: commonFr,
    forms: formsFr,
  },
  en: {
    common: commonEn,
    forms: formsEn,
  },
  pt: {
    common: commonPt,
    forms: formsPt,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // default language (French)
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    ns: ['common', 'forms'],
    defaultNS: 'common',
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
function UserForm() {
  const { t } = useTranslation('forms')
  
  return (
    <form>
      <label>{t('name.label')}</label>
      <input placeholder={t('name.placeholder')} />
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
// src/locales/fr/common.json - Traduções gerais reutilizáveis
{
  "welcome": "Bienvenue",
  "welcome_user": "Bienvenue, {{name}} !",
  "actions": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier",
    "create": "Créer"
  },
  "navigation": {
    "home": "Accueil",
    "dashboard": "Tableau de bord",
    "settings": "Paramètres"
  },
  "status": {
    "loading": "Chargement...",
    "error": "Erreur",
    "success": "Succès"
  }
}

// src/locales/fr/forms.json - Form-specific translations
{
  "user": {
    "name": {
      "label": "Nom",
      "placeholder": "Entrez votre nom",
      "error": "Le nom est requis"
    },
    "email": {
      "label": "Email",
      "placeholder": "Entrez votre email",
      "error": "Format d'email invalide"
    }
  },
  "validation": {
    "required": "Ce champ est obligatoire",
    "minLength": "Minimum {{count}} caractères",
    "maxLength": "Maximum {{count}} caractères"
  }
}

// src/locales/fr/auth.json - Authentication translations
{
  "login": {
    "title": "Connexion",
    "email": "Adresse email",
    "password": "Mot de passe",
    "submit": "Se connecter",
    "forgotPassword": "Mot de passe oublié ?"
  },
  "register": {
    "title": "Inscription",
    "confirmPassword": "Confirmer le mot de passe"
  }
}
```

#### i18n Best Practices
- Use descriptive, hierarchical keys (`forms.name.label`)
- Keep translations close to components when possible
- Implement type-safe translation keys using TypeScript
- Use interpolation for dynamic content
- Provide fallback values for missing translations
- Test all language variations
- Use namespaces to organize translations by feature

### Component Patterns

#### shadcn/ui Component Usage
- Use `cn()` utility for merging Tailwind classes
- Follow shadcn/ui patterns for component composition
- Place UI components in `src/components/ui/`
- Use Zod schemas for form validation and data types
- Leverage class-variance-authority for component variants

Example:
```tsx
import { cn } from "@/lib/utils"
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
- Co-locate API response schemas with their respective query hooks
- Example structure:
  ```typescript
  // src/hooks/queries/useChatbots.ts
  const ChatbotSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(['active', 'inactive']),
  })
  type Chatbot = z.infer<typeof ChatbotSchema>
  
  // src/services/chatbot.ts
  const CreateChatbotSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
  })
  type CreateChatbotRequest = z.infer<typeof CreateChatbotSchema>
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

- The project currently contains the default Vite+React template code
- HMR (Hot Module Replacement) is enabled for fast development
- ESLint is configured to ignore the `dist` directory
- The build process includes TypeScript compilation before bundling
- Prepared for Tanstack Router integration (file-based routing)

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