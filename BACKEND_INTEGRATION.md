# Backend Integration Guide
# MultiSaasWeb ↔ Multi-Saas API

**Last Updated:** 2025-10-11
**Backend Location:** `~/Desktop/multi-saas`
**API Base URL:** `http://localhost:3333`

---

## 📋 Table of Contents

1. [Backend Overview](#backend-overview)
2. [API Endpoints Status](#api-endpoints-status)
3. [Frontend-Backend Mapping](#frontend-backend-mapping)
4. [Integration Priorities](#integration-priorities)
5. [Implementation Plan](#implementation-plan)

---

## 🔍 Backend Overview

### Technology Stack

- **Framework:** Fastify + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT with refresh tokens
- **Payment:** Stripe with webhooks
- **Architecture:** Clean Architecture + Domain-Driven Design
- **Testing:** Node.js test runner (unit + e2e)
- **AI Integration:** RAGFlow HTTP API

### Key Features

✅ **Fully Implemented:**
- Multi-tenant architecture with subdomain routing
- JWT authentication with refresh tokens
- Stripe subscription management
- Email verification flow
- Role-based access control (RBAC)
- Knowledge base management (RAGFlow integration)
- Chatbot creation and management
- Widget embed code generation
- Usage tracking and limits
- Invitation system

### Modules Structure

```
src/modules/
├── account/          # User profile management
├── auth/             # Authentication (login, register, refresh)
├── chatbot/          # Chatbot CRUD and conversations
├── invitation/       # Team member invitations
├── limits/           # Usage limits and tracking
├── ragflow/          # RAGFlow integration (knowledge bases)
├── rbac/             # Role-based access control
├── subscription/     # Stripe billing and plans
├── tenant/           # Tenant management
└── widget/           # Widget settings and public API
```

---

## ✅ API Endpoints Status

### 🟢 **Authentication & Account** (FULLY IMPLEMENTED)

| Method | Endpoint | Status | Frontend Hook | Notes |
|--------|----------|--------|---------------|-------|
| POST | `/api/auth/register` | ✅ | `use-auth.ts` | Email verification sent |
| POST | `/api/auth/login` | ✅ | `use-auth.ts` | Returns access + refresh tokens |
| POST | `/api/auth/refresh-token` | ✅ | `use-auth.ts` | Automatic token refresh |
| POST | `/api/auth/forgot-password` | ✅ | `use-auth.ts` | Sends reset email |
| POST | `/api/auth/reset-password` | ✅ | `use-auth.ts` | With token from email |
| GET | `/api/auth/verify-email/:token` | ✅ | `use-auth.ts` | Email confirmation |
| GET | `/api/users/me` | ✅ | `use-auth.ts` | Current user profile |
| PUT | `/api/users/me` | ✅ | `use-users.ts` | Update profile |
| DELETE | `/api/users/me` | ✅ | `use-users.ts` | Delete account |

### 🟢 **Tenant Management** (FULLY IMPLEMENTED)

| Method | Endpoint | Status | Frontend Hook | Notes |
|--------|----------|--------|---------------|-------|
| POST | `/api/tenants` | ✅ | `use-tenants.ts` | Create tenant |
| GET | `/api/tenants` | ✅ | `use-tenants.ts` | List user's tenants |
| PUT | `/api/tenants/:id` | ✅ | `use-tenants.ts` | Update tenant |
| DELETE | `/api/tenants/:id` | ✅ | `use-tenants.ts` | Delete tenant |
| PUT | `/api/tenants/:id/subdomain` | ✅ | `use-tenants.ts` | Set custom subdomain |
| GET | `/api/tenants/:id/users` | ✅ | `use-tenants.ts` | List tenant members |
| DELETE | `/api/tenants/:id/users/:userId` | ✅ | `use-tenants.ts` | Remove member |

### 🟢 **Invitations** (FULLY IMPLEMENTED)

| Method | Endpoint | Status | Frontend Hook | Notes |
|--------|----------|--------|---------------|-------|
| POST | `/api/invitations` | ✅ | Need to create | Invite team member |
| GET | `/api/invitations` | ✅ | Need to create | List invitations |
| POST | `/api/invitations/:id/accept` | ✅ | Need to create | Accept invitation |
| POST | `/api/invitations/:id/revoke` | ✅ | Need to create | Revoke invitation |
| POST | `/api/invitations/:id/resend` | ✅ | Need to create | Resend invitation email |

### 🟢 **Subscription & Billing** (FULLY IMPLEMENTED)

| Method | Endpoint | Status | Frontend Hook | Notes |
|--------|----------|--------|---------------|-------|
| GET | `/api/plans` | ✅ | `use-plans.ts` | List available plans |
| GET | `/api/subscription` | ✅ | `use-subscription.ts` | Current subscription |
| POST | `/api/subscription/checkout` | ✅ | `use-subscription.ts` | Create Stripe checkout |
| POST | `/api/subscription/portal` | ✅ | `use-subscription.ts` | Customer portal session |
| POST | `/api/subscription/cancel` | ✅ | `use-subscription.ts` | Cancel subscription |
| POST | `/api/webhooks/stripe` | ✅ | - | Stripe webhook handler |

### 🟢 **Resource Limits & Usage** (FULLY IMPLEMENTED)

| Method | Endpoint | Status | Frontend Hook | Notes |
|--------|----------|--------|---------------|-------|
| GET | `/api/limits` | ✅ | Need to create | Get tenant limits |
| GET | `/api/usage` | ✅ | Need to create | Current usage stats |

### 🟢 **Knowledge Base (RAGFlow)** (FULLY IMPLEMENTED)

| Method | Endpoint | Status | Frontend Hook | Notes |
|--------|----------|--------|---------------|-------|
| POST | `/api/ragflow/knowledge-bases` | ✅ | Need to create | Create KB |
| GET | `/api/ragflow/knowledge-bases` | ✅ | Need to create | List KBs |
| GET | `/api/ragflow/knowledge-bases/:id` | ✅ | Need to create | Get KB details |
| PUT | `/api/ragflow/knowledge-bases/:id` | ✅ | Need to create | Update KB |
| DELETE | `/api/ragflow/knowledge-bases/:id` | ✅ | Need to create | Delete KB |
| POST | `/api/ragflow/knowledge-bases/:id/documents` | ✅ | Need to create | Upload document |
| GET | `/api/ragflow/knowledge-bases/:id/documents` | ✅ | Need to create | List documents |
| DELETE | `/api/ragflow/knowledge-bases/:id/documents/:docId` | ✅ | Need to create | Delete document |
| POST | `/api/ragflow/knowledge-bases/:id/web-crawl` | ✅ | Need to create | Crawl website |
| POST | `/api/ragflow/chat` | ✅ | Need to create | Chat with KB |

### 🟢 **Chatbot Management** (FULLY IMPLEMENTED)

| Method | Endpoint | Status | Frontend Hook | Notes |
|--------|----------|--------|---------------|-------|
| POST | `/api/chatbots` | ✅ | `use-chatbots.ts` | Create chatbot |
| GET | `/api/chatbots` | ✅ | `use-chatbots.ts` | List chatbots |
| GET | `/api/chatbots/:id` | ✅ | `use-chatbots.ts` | Get chatbot |
| PUT | `/api/chatbots/:id` | ✅ | `use-chatbots.ts` | Update chatbot |
| DELETE | `/api/chatbots/:id` | ✅ | `use-chatbots.ts` | Delete chatbot |
| POST | `/api/chatbots/:id/chat` | ✅ | Need to create | Send chat message |
| GET | `/api/chatbots/:id/conversations` | ✅ | Need to create | Conversation history |

### 🟢 **Widget (PUBLIC API)** (FULLY IMPLEMENTED)

| Method | Endpoint | Status | Frontend Hook | Notes |
|--------|----------|--------|---------------|-------|
| POST | `/api/widgets` | ✅ | Need to create | Create widget settings |
| GET | `/api/widgets/:chatbotId` | ✅ | Need to create | Get widget config |
| PUT | `/api/widgets/:chatbotId` | ✅ | Need to create | Update widget |
| POST | `/api/widgets/:chatbotId/embed-code` | ✅ | Need to create | Generate embed code |
| GET | `/api/public/widget/:chatbotId/config` | ✅ | - | Public widget config |
| POST | `/api/public/widget/:chatbotId/message` | ✅ | - | Public chat endpoint |

---

## 🔄 Frontend-Backend Mapping

### Current Frontend Implementation Status

#### ✅ **Implemented Frontend Features:**

1. **Authentication Pages**
   - ✅ Login page → Uses `POST /api/auth/login`
   - ✅ Register page → Uses `POST /api/auth/register`
   - ✅ Verify email page → Uses `GET /api/auth/verify-email/:token`
   - ✅ Reset password page → Uses `POST /api/auth/reset-password`
   - ✅ Renew password page → Uses `POST /api/auth/forgot-password`

2. **Dashboard Layout**
   - ✅ Sidebar navigation
   - ✅ User menu with tenant switcher
   - ✅ Breadcrumb navigation
   - ✅ Mobile responsive

3. **Tenant Management**
   - ✅ Create tenant page → Uses `POST /api/tenants`
   - ⚠️ Tenant switcher (UI only, needs backend integration)
   - ⚠️ Tenant settings (UI only)

4. **Settings Pages (UI Structure Only)**
   - ⚠️ General settings
   - ⚠️ Team members
   - ⚠️ Plans & billing
   - ⚠️ Security settings

#### ❌ **Missing Frontend Features:**

1. **Chatbot Functionality**
   - ❌ Chatbot listing (UI exists, no data)
   - ❌ Chatbot creation flow (UI exists, no backend integration)
   - ❌ Chatbot playground/testing
   - ❌ Widget configuration
   - ❌ Widget embed code display

2. **Knowledge Base**
   - ❌ KB listing
   - ❌ KB creation
   - ❌ Document upload
   - ❌ Website crawling
   - ❌ Processing status tracking

3. **Analytics & Usage**
   - ❌ Conversation history
   - ❌ Usage dashboard
   - ❌ Analytics charts

4. **Team Collaboration**
   - ❌ Invitation system
   - ❌ Member management
   - ❌ Role assignment

5. **Subscription Management**
   - ❌ Plan selection/upgrade
   - ❌ Billing management
   - ❌ Invoice history

---

## 🎯 Integration Priorities

### Phase 1: Core Chatbot Functionality (CRITICAL) 🔥

**Goal:** Make chatbots functional with basic conversation capability

**Tasks:**

1. **Knowledge Base Integration** (1 week)
   - Create `use-knowledge-base.ts` hook
   - Implement KB creation with RAGFlow
   - Document upload interface
   - Website crawling
   - Processing status tracking

2. **Chatbot Creation & Management** (1 week)
   - Connect chatbot creation wizard to backend
   - Link chatbot to knowledge base
   - Save chatbot configuration
   - List and display chatbots with real data

3. **Chatbot Playground** (3-4 days)
   - Create chat interface component
   - Integrate with `POST /api/chatbots/:id/chat`
   - Display conversation history
   - Show source citations
   - Real-time message streaming

4. **Widget Configuration** (3-4 days)
   - Widget settings form
   - Generate embed code
   - Display embed code with copy button
   - Widget preview

**Acceptance Criteria:**
- ✅ Users can create a chatbot linked to a knowledge base
- ✅ Users can upload documents to knowledge base
- ✅ Users can test chatbot in playground
- ✅ Chatbot responds using RAG from uploaded documents
- ✅ Users can generate widget embed code

---

### Phase 2: Analytics & Monitoring (HIGH) 📊

**Goal:** Provide visibility into chatbot performance and usage

**Tasks:**

1. **Conversation History** (3 days)
   - Create `use-conversations.ts` hook
   - Conversation list component
   - Conversation detail viewer
   - Filters (date, status, rating)
   - Export functionality

2. **Usage Dashboard** (3 days)
   - Create `use-usage.ts` hook
   - Usage metrics component
   - Quota tracking display
   - Warning notifications
   - Chart visualizations (recharts)

3. **Analytics Dashboard** (4 days)
   - Analytics overview cards
   - Conversation trends chart
   - Popular questions analysis
   - Response time metrics
   - User satisfaction tracking

**Acceptance Criteria:**
- ✅ Users can view all conversations
- ✅ Users can see usage against quotas
- ✅ Users receive warnings when approaching limits
- ✅ Users can view analytics charts

---

### Phase 3: Team Collaboration (MEDIUM) 👥

**Goal:** Enable team management and collaboration

**Tasks:**

1. **Invitation System** (3 days)
   - Create `use-invitations.ts` hook
   - Invitation form component
   - Pending invitations list
   - Resend/revoke actions
   - Accept invitation flow

2. **Team Members Management** (2 days)
   - Members list component
   - Role selector
   - Remove member action
   - Activity log

**Acceptance Criteria:**
- ✅ Admins can invite team members
- ✅ Members receive invitation emails
- ✅ Members can accept invitations
- ✅ Admins can change member roles
- ✅ Admins can remove members

---

### Phase 4: Subscription & Billing (HIGH) 💰

**Goal:** Complete monetization flow

**Tasks:**

1. **Plan Selection** (2 days)
   - Update plans page with real data from `use-plans.ts`
   - Plan comparison component
   - Upgrade/downgrade flow
   - Stripe checkout integration

2. **Billing Management** (2 days)
   - Current subscription display
   - Payment method management
   - Invoice history
   - Cancel subscription flow

3. **Usage Limits Enforcement** (1 day)
   - Quota checking middleware
   - Limit reached notifications
   - Upgrade prompts

**Acceptance Criteria:**
- ✅ Users can subscribe to plans
- ✅ Plan limits are enforced
- ✅ Users can manage billing
- ✅ Invoices are accessible
- ✅ Users can cancel subscription

---

### Phase 5: Refactoring & Polish (ONGOING) 🔧

**Goal:** Improve code quality, performance, and UX

**Tasks:**

1. **Code Refactoring**
   - Remove mock data from components
   - Consolidate duplicate logic
   - Improve error handling
   - Add loading states everywhere
   - Add skeleton loaders

2. **UX Improvements**
   - Better empty states
   - Success/error toast notifications
   - Form validation improvements
   - Accessibility improvements
   - Mobile optimization

3. **Performance**
   - Optimize bundle size
   - Implement route-level code splitting
   - Add React.memo where needed
   - Optimize image loading

4. **Testing**
   - Unit tests for critical hooks
   - Component tests
   - E2E tests for critical flows

**Acceptance Criteria:**
- ✅ No console errors or warnings
- ✅ All forms have proper validation
- ✅ Loading states are consistent
- ✅ Error handling is user-friendly
- ✅ Test coverage > 70%

---

## 🛠️ Implementation Plan

### Detailed Step-by-Step Guide

#### **Step 1: Set Up API Client Configuration**

**Files to Update:**
- `src/lib/axios.ts`
- `src/lib/api-with-tenant.ts`

**Tasks:**
```typescript
// Ensure axios client is properly configured
// Add request interceptors for tenant context
// Add response interceptors for error handling
// Add token refresh logic
```

**Acceptance Criteria:**
- ✅ All API calls include tenant context from subdomain
- ✅ JWT tokens are automatically refreshed
- ✅ Errors are handled consistently

---

#### **Step 2: Create Missing Hooks**

**New Hooks to Create:**

1. **`src/hooks/use-knowledge-base.ts`**
```typescript
// Query: List knowledge bases
// Query: Get knowledge base details
// Mutation: Create knowledge base
// Mutation: Update knowledge base
// Mutation: Delete knowledge base
// Mutation: Upload document
// Mutation: Crawl website
// Query: List documents
// Mutation: Delete document
```

2. **`src/hooks/use-conversations.ts`**
```typescript
// Query: List conversations
// Query: Get conversation details
// Mutation: Send chat message (with streaming support)
// Query: Get conversation history
```

3. **`src/hooks/use-invitations.ts`**
```typescript
// Query: List invitations
// Mutation: Create invitation
// Mutation: Accept invitation
// Mutation: Revoke invitation
// Mutation: Resend invitation
```

4. **`src/hooks/use-usage.ts`**
```typescript
// Query: Get current usage
// Query: Get tenant limits
// Query: Get usage report
```

5. **`src/hooks/use-widget.ts`**
```typescript
// Query: Get widget settings
// Mutation: Create widget settings
// Mutation: Update widget settings
// Mutation: Generate embed code
```

---

#### **Step 3: Update Existing Hooks**

**Files to Update:**

1. **`src/hooks/use-chatbots.ts`**
   - Add `useSendChatMessage` mutation
   - Add `useConversations` query
   - Add proper error handling
   - Add optimistic updates

2. **`src/hooks/use-tenants.ts`**
   - Add `useSetSubdomain` mutation
   - Add `useTenantUsers` query
   - Add `useRemoveTenantUser` mutation

3. **`src/hooks/use-subscription.ts`**
   - Connect to real API endpoints
   - Add Stripe checkout integration
   - Add cancel subscription mutation

4. **`src/hooks/use-plans.ts`**
   - Connect to real API endpoint
   - Remove mock data

---

#### **Step 4: Implement Core Features**

**Priority Order:**

1. **Knowledge Base Creation** (`/dashboard/knowledge-base/create`)
   - Wire up file upload
   - Implement website crawling
   - Show processing status
   - Handle errors gracefully

2. **Chatbot Creation** (`/dashboard/chatbots/create`)
   - Connect to backend
   - Link to knowledge base
   - Save configuration
   - Redirect to chatbot detail

3. **Chatbot Playground** (`/dashboard/chatbots/$id`)
   - Create chat interface
   - Implement message sending
   - Display conversation
   - Show source citations

4. **Widget Configuration** (`/dashboard/chatbots/$id/widget`)
   - Widget settings form
   - Generate embed code
   - Display embed code
   - Copy to clipboard

---

#### **Step 5: Update UI Components**

**Components to Refactor:**

1. **Chatbots List** (`/dashboard/chatbots`)
   - Remove mock data
   - Fetch from `useChatbots()`
   - Add loading states
   - Add empty state
   - Add error handling

2. **Settings Pages**
   - General: Connect to `useUpdateTenant()`
   - Members: Connect to `useTenantUsers()` + `useInvitations()`
   - Plans: Connect to `usePlans()` + `useSubscription()`
   - Billing: Connect to `useSubscription()`

3. **Usage Page** (`/dashboard/usages`)
   - Connect to `useUsage()`
   - Display charts with recharts
   - Show quota warnings

---

#### **Step 6: Error Handling & Loading States**

**Global Error Handler:**
```typescript
// src/lib/error-handler.ts
export function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message
    toast.error(message)
  }
}
```

**Loading States Pattern:**
```typescript
const { data, isLoading, error } = useQuery(...)

if (isLoading) return <Skeleton />
if (error) return <ErrorState error={error} />
if (!data) return <EmptyState />

return <DataDisplay data={data} />
```

---

#### **Step 7: Testing**

**Test Strategy:**

1. **Unit Tests**
   - All custom hooks
   - Utility functions
   - Validation schemas

2. **Component Tests**
   - Form components
   - Critical UI components

3. **E2E Tests**
   - Complete chatbot creation flow
   - Chat conversation flow
   - Subscription flow

---

## 📝 API Request/Response Examples

### Example: Create Chatbot

**Request:**
```typescript
POST /api/chatbots
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Support Bot",
  "description": "Customer support chatbot",
  "configuration": {
    "knowledgeBaseId": "kb-123",
    "model": "gpt-4",
    "temperature": 0.7,
    "systemPrompt": "You are a helpful assistant..."
  }
}
```

**Response:**
```json
{
  "chatbot": {
    "id": "chatbot-456",
    "tenantId": "tenant-789",
    "name": "Support Bot",
    "description": "Customer support chatbot",
    "status": "draft",
    "configuration": {...},
    "createdAt": "2025-10-11T15:30:00Z"
  }
}
```

### Example: Send Chat Message

**Request:**
```typescript
POST /api/chatbots/chatbot-456/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "What are your business hours?",
  "sessionId": "session-123",
  "stream": true
}
```

**Response (Streaming):**
```typescript
// Server-Sent Events (SSE)
data: {"type": "token", "content": "Our"}
data: {"type": "token", "content": " business"}
data: {"type": "token", "content": " hours"}
data: {"type": "source", "document": "faq.pdf", "page": 3}
data: {"type": "done"}
```

---

## 🔐 Authentication Flow

### Token Management

```typescript
// 1. Login
POST /api/auth/login
Response: { accessToken, refreshToken }

// 2. Store tokens
localStorage.setItem('accessToken', accessToken)
httpOnly cookie: refreshToken

// 3. Use access token
Authorization: Bearer <accessToken>

// 4. Refresh when expired
POST /api/auth/refresh-token
Cookie: refreshToken
Response: { accessToken }

// 5. Logout
Clear localStorage + cookie
```

### Multi-Tenant Context

```typescript
// Extracted from subdomain
Host: acme.multisaas.app

// Backend automatically injects tenant context
request.currentTenant = { id, name, subdomain }

// All queries are scoped to tenant
prisma.chatbot.findMany({
  where: { tenantId: request.currentTenant.id }
})
```

---

## 🚀 Getting Started

### 1. Start Backend

```bash
cd ~/Desktop/multi-saas
pnpm install
docker-compose up -d  # Start PostgreSQL
npx prisma migrate dev
npx prisma db seed
pnpm dev  # Runs on port 3333
```

### 2. Start Stripe Webhook Listener

```bash
stripe listen --forward-to localhost:3333/webhooks/stripe
```

### 3. Configure Frontend Environment

```bash
# .env
VITE_API_URL=http://localhost:3333
VITE_APP_URL=http://lvh.me:3000
VITE_MAIN_DOMAIN=lvh.me:3000
```

### 4. Start Frontend

```bash
cd ~/saasbotweb/multisaasweb
pnpm install
pnpm dev  # Runs on port 3000
```

### 5. Access Application

```
http://lvh.me:3000  # Main domain
http://<subdomain>.lvh.me:3000  # Tenant subdomain
```

---

## 📚 Additional Resources

- **Backend Docs:** `~/Desktop/multi-saas/CLAUDE.md`
- **Architecture:** `~/Desktop/multi-saas/ARCHITECTURE.md`
- **RAGFlow API:** `~/Desktop/multi-saas/ragflowdoc.md`
- **Frontend Docs:** `~/saasbotweb/multisaasweb/CLAUDE.md`
- **PRD:** `~/saasbotweb/multisaasweb/PRD.md`

---

**Next Steps:** Start with Phase 1 - Knowledge Base Integration! 🚀
