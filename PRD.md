# Product Requirements Document (PRD)
# MultiSaasWeb - AI Chatbot Management Platform

**Version:** 1.0
**Last Updated:** 2025-10-11
**Status:** Active Development
**Owner:** Product Team

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Current Implementation Status](#current-implementation-status)
4. [Feature Roadmap](#feature-roadmap)
5. [Priority Features](#priority-features)
6. [Technical Requirements](#technical-requirements)
7. [Success Metrics](#success-metrics)

---

## 📊 Executive Summary

**MultiSaasWeb** is a modern SaaS platform for creating, managing, and deploying AI-powered chatbots. Similar to Chatbase, it provides an intuitive interface for businesses to build conversational AI experiences powered by RAGFlow's advanced retrieval-augmented generation technology.

### Core Value Proposition
- **Easy Chatbot Creation**: Visual wizard for building chatbots without coding
- **Multi-tenant Architecture**: Isolated environments for each customer
- **RAGFlow Integration**: Advanced AI capabilities with document understanding
- **Enterprise-Ready**: Team management, analytics, and security features

---

## 🎯 Product Vision

### Mission Statement
Empower businesses to create intelligent, context-aware chatbots that provide exceptional customer experiences through natural conversations and accurate information retrieval.

### Target Audience
1. **Small to Medium Businesses** (Primary)
   - Customer support teams
   - Sales teams
   - Marketing departments

2. **Enterprise Customers** (Secondary)
   - Large organizations needing custom AI solutions
   - Multiple departments requiring chatbot deployments

3. **Agencies & Resellers** (Tertiary)
   - Digital agencies managing client chatbots
   - SaaS resellers

---

## ✅ Current Implementation Status

### 🟢 Completed Features

#### Authentication & User Management
- ✅ User registration with email verification
- ✅ Login with JWT authentication
- ✅ Password reset flow (reset + renew)
- ✅ Email verification
- ✅ Multi-tenant isolation with subdomain routing

#### Infrastructure
- ✅ React 19 + TypeScript + Vite setup
- ✅ Tanstack Router (file-based routing)
- ✅ Tanstack Query (data fetching)
- ✅ i18next (PT, EN, FR, ES support)
- ✅ Tailwind CSS v4 + shadcn/ui components
- ✅ Axios client with tenant context
- ✅ Cookie-based session management

#### Dashboard Layout
- ✅ Authenticated routes structure
- ✅ Main dashboard layout with sidebar
- ✅ Navigation components (sidebar, breadcrumbs, user menu)
- ✅ Team/tenant switcher
- ✅ Mobile responsive layout

#### Chatbot Management (UI Structure)
- ✅ Chatbot creation wizard
  - ✅ File upload sources
  - ✅ Website sources
  - ✅ Text input sources
  - ✅ Knowledge base integration
- ✅ Chatbot demo/preview page
- ✅ Chatbot settings page structure
- ✅ Chatbot sources management page structure
- ✅ Widget content component

#### Knowledge Base (UI Structure)
- ✅ Knowledge base creation wizard
  - ✅ Files, websites, text sources
  - ✅ Knowledge settings
- ✅ Knowledge base listing page structure

#### Settings Pages (UI Structure)
- ✅ General settings page
- ✅ Team members page
- ✅ Subscription plans page
- ✅ Billing page
- ✅ Security settings page

#### Hooks & State Management
- ✅ `use-auth` - Authentication
- ✅ `use-chatbots` - Chatbot CRUD
- ✅ `use-tenants` - Tenant management
- ✅ `use-users` - User management
- ✅ `use-subscription` - Subscription state
- ✅ `use-plans` - Pricing plans
- ✅ `use-current-tenant` - Current tenant context
- ✅ `use-subdomain` - Subdomain utilities

### 🟡 Partially Implemented

- 🟡 Chatbot Analytics (UI components exist, backend integration pending)
- 🟡 Usage Statistics (route exists, implementation pending)
- 🟡 Settings pages (structure exists, functionality pending)

### 🟡 Backend Implemented - Frontend Integration Needed

**Note:** All backend APIs are implemented and documented. The work needed is frontend integration and UI implementation.

#### Team & Collaboration (Priority 1 - No RAGFlow dependency) - 🟢 90% Complete
- ✅ Backend: Team member invitation system
- ✅ Frontend: Invitation UI and email invitation flow
- ✅ Backend: Role-based access control (RBAC)
- ✅ Frontend: Permission guards and role-based UI
- ❌ Frontend: Accept invitation page (email link flow)
- ✅ Frontend: Portuguese translations in `settings.json`

#### Subscription & Billing (Priority 2 - No RAGFlow dependency)
- ✅ Backend: Stripe integration
- ❌ Frontend: Checkout flow and payment UI
- ✅ Backend: Subscription plan enforcement
- ❌ Frontend: Plan selection and upgrade UI
- ✅ Backend: Usage limits and quotas
- ❌ Frontend: Usage visualization and warnings
- ✅ Backend: Invoice generation
- ❌ Frontend: Invoice download and billing history

#### Tenant Management (Priority 3 - No RAGFlow dependency)
- ✅ Backend: Tenant CRUD operations
- ❌ Frontend: Tenant settings and configuration
- ✅ Backend: Subdomain management
- ❌ Frontend: Custom domain setup UI

#### Core Chatbot Features (Priority 4 - RAGFlow dependency)
- ✅ Backend: RAGFlow integration APIs
- ❌ Frontend: Knowledge base upload interface
- ✅ Backend: Chatbot conversation handling
- ❌ Frontend: Live chat playground
- ✅ Backend: Widget embed code generation
- ❌ Frontend: Widget customization UI
- ✅ Backend: Source file processing
- ❌ Frontend: Processing status tracking

#### Analytics & Monitoring (Priority 5)
- ✅ Backend: Conversation history and logs
- ❌ Frontend: Analytics dashboard
- ✅ Backend: Usage statistics APIs
- ❌ Frontend: Usage charts and metrics

#### Testing (All Priorities)
- ❌ Unit tests for hooks and utilities
- ❌ Integration tests for API calls
- ❌ E2E tests for critical flows

---

## 🗓️ Feature Roadmap (Re-prioritized)

**Strategy:** Implement features without RAGFlow dependency first, then add AI features.

### Phase 1: Team & Subscription Management (No RAGFlow) 🎯

#### 1.1 Team Member Invitations
**Priority:** Critical
**Estimated Effort:** 1 week
**Dependencies:** None (Backend ready ✅)

**Backend APIs Available:**
- `POST /invitations` - Create invitation
- `GET /invitations` - List invitations
- `POST /invitations/:id/resend` - Resend invitation
- `DELETE /invitations/:id` - Revoke invitation
- `POST /invitations/:id/accept` - Accept invitation

**Frontend Route:**
- `/accept-invitation?token={token}` - Page to accept invitation via email link

**Frontend Tasks:**
1. Create invitation form component
2. Implement invitation list with status badges
3. Add resend/revoke actions
4. Create accept invitation page
5. Add role selector (owner, admin, curator, user)

**Acceptance Criteria:**
- [x] Users can invite team members via email
- [x] Invitations show status (pending, accepted, revoked, expired)
- [x] Users can resend or revoke pending invitations
- [ ] Invited users can accept invitations via email link ⚠️ **Missing: Accept invitation page**
- [x] Role-based permissions are assigned correctly

---

#### 1.2 Subscription & Billing Integration
**Priority:** Critical
**Estimated Effort:** 2 weeks
**Dependencies:** None (Backend ready ✅)

**Backend APIs Available:**
- `GET /api/v1/plans` - List available plans
- `POST /api/v1/checkout/session` - Create Stripe checkout
- `POST /api/v1/checkout/portal` - Customer portal session
- `GET /api/v1/subscriptions/current` - Current subscription
- `POST /api/v1/subscriptions/cancel` - Cancel subscription

**Frontend Tasks:**
1. Create pricing page with plan cards
2. Implement Stripe Checkout integration
3. Build subscription management page
4. Add invoice history display
5. Implement cancel/upgrade flows
6. Create usage visualization components

**Acceptance Criteria:**
- [ ] Users can view available plans with features
- [ ] Users can subscribe via Stripe Checkout
- [ ] Current subscription details are displayed
- [ ] Users can upgrade/downgrade plans
- [ ] Users can cancel subscription
- [ ] Invoice history is accessible
- [ ] Usage limits are displayed with warnings

---

#### 1.3 RBAC & Permissions
**Priority:** High
**Estimated Effort:** 1 week
**Dependencies:** 1.1

**Backend APIs Available:**
- `GET /api/v1/tenants/:id/members` - List team members
- `PUT /api/v1/tenants/:id/members/:userId/role` - Update role
- `DELETE /api/v1/tenants/:id/members/:userId` - Remove member

**Frontend Tasks:**
1. Create permission guard components
2. Implement role-based UI rendering
3. Add member management table
4. Create role change dialog
5. Implement remove member confirmation

**Acceptance Criteria:**
- [x] UI elements respect user permissions
- [x] Admin actions are restricted to admins/owners
- [x] Users can view team member roles
- [x] Admins can change member roles
- [x] Owners can remove members
- [x] Permission errors are handled gracefully

---

### Phase 2: Tenant & Settings Enhancement 🏢

#### 2.1 Tenant Settings
**Priority:** Medium
**Estimated Effort:** 1 week
**Dependencies:** None (Backend ready ✅)

**Backend APIs Available:**
- `GET /api/v1/tenants/current` - Get current tenant
- `PUT /api/v1/tenants/:id` - Update tenant
- `PUT /api/v1/tenants/:id/subdomain` - Update subdomain

**Frontend Tasks:**
1. Implement tenant general settings form
2. Add subdomain change functionality
3. Create tenant branding settings
4. Add tenant deletion with confirmation

**Acceptance Criteria:**
- [ ] Users can update tenant name and details
- [ ] Users can change subdomain (with validation)
- [ ] Subdomain changes redirect properly
- [ ] Tenant deletion requires confirmation
- [ ] All changes are persisted correctly

---

### Phase 3: RAGFlow Integration & AI Features 🤖

#### 3.1 Knowledge Base Management
**Priority:** High
**Estimated Effort:** 2 weeks
**Dependencies:** None (Backend ready ✅)

**Backend APIs Available:**
- `POST /api/v1/tenants/:id/ragflow/datasets` - Create dataset
- `GET /api/v1/tenants/:id/ragflow/datasets` - List datasets
- `POST /api/v1/tenants/:id/ragflow/datasets/:id/documents` - Upload document
- `DELETE /api/v1/tenants/:id/ragflow/datasets/:id/documents/:docId` - Delete document

**Frontend Tasks:**
1. Create knowledge base creation wizard
2. Implement file upload with drag-and-drop
3. Add document list with status indicators
4. Create processing status tracking
5. Implement source management (delete, re-index)

**Acceptance Criteria:**
- [ ] Users can create knowledge bases
- [ ] Files upload successfully with progress tracking
- [ ] Processing status updates in real-time
- [ ] Users can manage uploaded documents
- [ ] Error states are properly handled

---

#### 3.2 Chatbot Creation & Configuration
**Priority:** High
**Estimated Effort:** 1 week
**Dependencies:** 3.1 (Backend ready ✅)

**Backend APIs Available:**
- `POST /api/v1/tenants/:id/ragflow/chatbots` - Create chatbot
- `GET /api/v1/tenants/:id/ragflow/chatbots` - List chatbots
- `PUT /api/v1/tenants/:id/ragflow/chatbots/:id` - Update chatbot
- `DELETE /api/v1/tenants/:id/ragflow/chatbots/:id` - Delete chatbot

**Frontend Tasks:**
1. Connect chatbot creation form to API
2. Implement chatbot settings page
3. Add knowledge base selection
4. Create chatbot deletion flow

**Acceptance Criteria:**
- [ ] Users can create chatbots
- [ ] Chatbots can be configured with knowledge bases
- [ ] Settings are saved correctly
- [ ] Chatbots can be deleted

---

#### 3.3 Chatbot Playground & Testing
**Priority:** High
**Estimated Effort:** 1 week
**Dependencies:** 3.2 (Backend ready ✅)

**Backend APIs Available:**
- `POST /api/v1/tenants/:id/ragflow/chatbots/:id/conversation` - Start conversation
- `POST /api/v1/tenants/:id/ragflow/chatbots/:id/conversation/:conversationId` - Send message
- `GET /api/v1/tenants/:id/ragflow/chatbots/:id/conversations` - List conversations

**Frontend Tasks:**
1. Create live chat interface
2. Implement message history display
3. Add source citation display
4. Create model settings panel
5. Add conversation reset

**Acceptance Criteria:**
- [ ] Users can chat with their chatbot in real-time
- [ ] Messages show source citations
- [ ] Model parameters are adjustable
- [ ] Conversation can be reset
- [ ] Loading states are implemented

---

#### 3.4 Widget Configuration & Embed
**Priority:** High
**Estimated Effort:** 1 week
**Dependencies:** 3.2 (Backend ready ✅)

**Backend APIs Available:**
- `POST /api/v1/tenants/:id/chatbots/:id/widget` - Create widget
- `GET /api/v1/tenants/:id/chatbots/:id/widget` - Get widget config
- `PUT /api/v1/tenants/:id/chatbots/:id/widget` - Update widget
- `GET /api/public/widget/:widgetId` - Public widget endpoint

**Frontend Tasks:**
1. Create widget customization UI
2. Implement embed code generator
3. Add live widget preview
4. Create copy-to-clipboard functionality
5. Add installation instructions

**Acceptance Criteria:**
- [ ] Users can customize widget appearance
- [ ] Embed code is generated correctly
- [ ] Preview shows real-time changes
- [ ] Code can be copied easily
- [ ] Installation guide is clear

---

### Phase 4: Analytics & Insights 📊

#### 2.1 Conversation Analytics
**Priority:** Medium
**Estimated Effort:** 2 weeks
**Dependencies:** 1.1, 1.2

**Requirements:**
- Conversation history viewer
- Message-level analytics
- User satisfaction tracking
- Response time metrics
- Popular queries analysis

**Metrics to Track:**
- Total conversations
- Average conversation length
- User satisfaction scores
- Response accuracy
- Most common queries
- Failed queries (no answer found)

**UI Components:**
- Conversation list with filters
- Individual conversation viewer
- Analytics dashboard with charts
- Export functionality (CSV, JSON)

**Acceptance Criteria:**
- [ ] All conversations are logged and viewable
- [ ] Analytics dashboard shows key metrics
- [ ] Users can filter conversations by date, status, rating
- [ ] Users can export conversation data
- [ ] Charts visualize trends over time

---

#### 2.2 Usage Dashboard
**Priority:** Medium
**Estimated Effort:** 1 week
**Dependencies:** 2.1

**Requirements:**
- Real-time usage statistics
- Quota tracking and warnings
- Cost estimation
- Usage breakdown by chatbot

**Metrics:**
- API calls count
- Storage used (documents)
- Messages processed
- Active users
- Bandwidth usage

**Acceptance Criteria:**
- [ ] Dashboard shows current plan usage
- [ ] Users receive warnings when approaching limits
- [ ] Usage can be viewed per chatbot
- [ ] Historical usage data is accessible
- [ ] Cost projections are displayed

---

### Phase 3: Team & Collaboration 👥

#### 3.1 Team Member Management
**Priority:** Medium
**Estimated Effort:** 2 weeks
**Dependencies:** None

**Requirements:**
- Invite team members via email
- Role-based permissions (Admin, Editor, Viewer)
- Member removal
- Pending invitations management
- Activity log per member

**Roles:**
- **Admin**: Full access, billing, team management
- **Editor**: Create/edit chatbots, view analytics
- **Viewer**: Read-only access

**Acceptance Criteria:**
- [ ] Admins can invite members via email
- [ ] Invitations can be resent or revoked
- [ ] Members can accept invitations and join
- [ ] Role-based permissions are enforced
- [ ] Members can be removed from teams

---

#### 3.2 Audit Logs
**Priority:** Low
**Estimated Effort:** 1 week
**Dependencies:** 3.1

**Requirements:**
- Log all important actions
- Filter by user, action type, date
- Export audit logs
- Retention policy

**Events to Log:**
- Chatbot created/updated/deleted
- Sources added/removed
- Settings changed
- Team members added/removed
- Subscription changes

**Acceptance Criteria:**
- [ ] All critical actions are logged
- [ ] Logs can be filtered and searched
- [ ] Logs can be exported
- [ ] Old logs are automatically archived

---

### Phase 4: Monetization & Growth 💰

#### 4.1 Subscription Management
**Priority:** High
**Estimated Effort:** 2 weeks
**Dependencies:** None

**Requirements:**
- Stripe integration
- Multiple subscription tiers
- Usage-based billing
- Automatic plan enforcement
- Grace period for overages

**Plans:**
- **Free**: 1 chatbot, 100 messages/month
- **Starter**: 3 chatbots, 1,000 messages/month
- **Professional**: 10 chatbots, 10,000 messages/month
- **Enterprise**: Unlimited, custom pricing

**Acceptance Criteria:**
- [ ] Users can subscribe to plans via Stripe
- [ ] Plan limits are enforced automatically
- [ ] Users can upgrade/downgrade plans
- [ ] Invoices are generated and emailed
- [ ] Failed payments are handled gracefully

---

#### 4.2 Billing & Invoices
**Priority:** Medium
**Estimated Effort:** 1 week
**Dependencies:** 4.1

**Requirements:**
- Invoice history
- Payment method management
- Billing address management
- Downloadable invoices (PDF)
- Tax handling

**Acceptance Criteria:**
- [ ] Users can view invoice history
- [ ] Users can update payment methods
- [ ] Invoices can be downloaded as PDF
- [ ] Tax is calculated correctly based on location
- [ ] Billing information can be edited

---

### Phase 5: Advanced Features 🚀

#### 5.1 Custom Branding
**Priority:** Low
**Estimated Effort:** 1 week
**Dependencies:** 1.3

**Requirements:**
- White-label options
- Custom domain for widget
- Remove "Powered by" branding
- Custom colors and logo

**Acceptance Criteria:**
- [ ] Enterprise users can use custom domains
- [ ] Branding can be customized (logo, colors)
- [ ] "Powered by" can be removed (paid feature)

---

#### 5.2 API Access
**Priority:** Low
**Estimated Effort:** 2 weeks
**Dependencies:** None

**Requirements:**
- REST API for programmatic access
- API key generation and management
- Rate limiting
- API documentation (OpenAPI/Swagger)
- Webhooks for events

**Acceptance Criteria:**
- [ ] Users can generate API keys
- [ ] API is documented and accessible
- [ ] Rate limits are enforced
- [ ] Webhooks fire for important events

---

#### 5.3 Advanced Analytics
**Priority:** Low
**Estimated Effort:** 2 weeks
**Dependencies:** 2.1

**Requirements:**
- Sentiment analysis
- Topic clustering
- User journey mapping
- A/B testing for responses
- Custom reports

**Acceptance Criteria:**
- [ ] Sentiment is tracked for conversations
- [ ] Common topics are automatically identified
- [ ] Custom reports can be created
- [ ] A/B tests can be configured

---

## 🎯 Priority Features (Reorganized by Backend Dependency)

### Sprint Goals
Focus on features that don't require RAGFlow integration first, then progressively add AI capabilities.

### Must-Have - Sprint 1 (2 weeks) - Zero RAGFlow Dependency
**Goal:** Complete team collaboration and subscription features

1. **Team Member Invitations** (Phase 1.1)
   - Invitation form and email flow
   - Status tracking (pending, accepted, revoked)
   - Resend and revoke actions
   - Accept invitation page
   - **Estimated:** 3-4 days

2. **Subscription & Billing** (Phase 1.2)
   - Stripe Checkout integration
   - Pricing page with plan cards
   - Subscription management dashboard
   - Invoice history
   - Cancel/upgrade flows
   - **Estimated:** 5-7 days

3. **RBAC & Permissions** (Phase 1.3)
   - Permission guard components
   - Role-based UI rendering
   - Member management interface
   - **Estimated:** 3-4 days

### Should-Have - Sprint 2 (1 week) - Zero RAGFlow Dependency
**Goal:** Complete tenant management and settings

4. **Tenant Settings** (Phase 2.1)
   - General settings form
   - Subdomain management
   - Tenant branding
   - Delete tenant flow
   - **Estimated:** 4-5 days

### Could-Have - Sprint 3 (2 weeks) - RAGFlow Required
**Goal:** Add AI chatbot capabilities

5. **Knowledge Base Management** (Phase 3.1)
   - KB creation wizard
   - File upload with drag-and-drop
   - Document management
   - Processing status tracking
   - **Estimated:** 6-8 days

6. **Chatbot Creation** (Phase 3.2)
   - Chatbot CRUD interface
   - Settings configuration
   - Knowledge base linking
   - **Estimated:** 4-5 days

### Nice-to-Have - Sprint 4 (1 week) - RAGFlow Required
**Goal:** Add chat testing and widget embedding

7. **Chatbot Playground** (Phase 3.3)
   - Live chat interface
   - Conversation history
   - Model settings panel
   - **Estimated:** 4-5 days

8. **Widget Configuration** (Phase 3.4)
   - Widget customization UI
   - Embed code generator
   - Live preview
   - **Estimated:** 3-4 days

---

## 🔧 Technical Requirements

### Backend API Status

**✅ All backend APIs are IMPLEMENTED and documented in Swagger.**

API documentation available at: `http://localhost:3333/docs/json`

For detailed API integration guide, see: `BACKEND_INTEGRATION.md`

#### Key Backend Endpoints (Already Available)

**Authentication (✅ Ready)**
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Multi-tenant data isolation via subdomain
- Cookie-based sessions

**Team Management (✅ Backend Ready | 🟢 Frontend Implemented)**
```
POST   /invitations                     # Create invitation
GET    /invitations                     # List invitations
POST   /invitations/:id/resend          # Resend invitation
DELETE /invitations/:id                 # Revoke invitation
POST   /invitations/:id/accept          # Accept invitation (⚠️ Frontend page missing)
GET    /users                           # List team members (current tenant)
PATCH  /tenants/users/:userId/role      # Update member role
DELETE /tenants/users/:userId           # Remove member
```

**Subscription & Billing (✅ Ready)**
```
GET    /api/v1/plans                      # List available plans
POST   /api/v1/checkout/session           # Create Stripe checkout
POST   /api/v1/checkout/portal            # Customer portal session
GET    /api/v1/subscriptions/current      # Current subscription
POST   /api/v1/subscriptions/cancel       # Cancel subscription
GET    /api/v1/limits/usage               # Current usage statistics
```

**Tenant Management (✅ Ready)**
```
GET    /api/v1/tenants/current            # Get current tenant
PUT    /api/v1/tenants/:id                # Update tenant
PUT    /api/v1/tenants/:id/subdomain      # Update subdomain
DELETE /api/v1/tenants/:id                # Delete tenant
```

**RAGFlow Integration (✅ Ready - Use in Phase 3+)**
```
POST   /api/v1/tenants/:id/ragflow/datasets # Create knowledge base
GET    /api/v1/tenants/:id/ragflow/datasets # List knowledge bases
POST   /api/v1/tenants/:id/ragflow/datasets/:id/documents # Upload document
POST   /api/v1/tenants/:id/ragflow/chatbots # Create chatbot
GET    /api/v1/tenants/:id/ragflow/chatbots # List chatbots
POST   /api/v1/tenants/:id/ragflow/chatbots/:id/conversation # Start chat
```

**Widget (✅ Ready - Use in Phase 3+)**
```
POST   /api/v1/tenants/:id/chatbots/:id/widget # Create widget
GET    /api/v1/tenants/:id/chatbots/:id/widget # Get widget config
PUT    /api/v1/tenants/:id/chatbots/:id/widget # Update widget
GET    /api/public/widget/:widgetId            # Public widget endpoint (no auth)
POST   /api/public/widget/:widgetId/message    # Send message (no auth)
```

### Frontend Technical Debt
- [ ] Add comprehensive error boundaries
- [ ] Implement proper loading states for all async operations
- [ ] Add skeleton loaders for better UX
- [ ] Optimize bundle size (code splitting)
- [ ] Add unit tests for critical components
- [ ] Add E2E tests for critical flows
- [ ] Implement proper form validation messages
- [ ] Add toast notifications for all user actions
- [ ] Implement proper 404 and error pages
- [ ] Add proper meta tags and SEO

### Performance Requirements
- Time to Interactive (TTI): < 3 seconds
- First Contentful Paint (FCP): < 1.5 seconds
- API response time: < 500ms (95th percentile)
- Widget load time: < 2 seconds
- Real-time chat latency: < 1 second

### Security Requirements
- [ ] HTTPS only (enforce)
- [ ] Content Security Policy (CSP) headers
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting on all endpoints
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] Secure file upload handling
- [ ] API key rotation mechanism
- [ ] Regular security audits

---

## 📈 Success Metrics

### Product Metrics
- **User Acquisition**
  - New signups per week
  - Activation rate (created first chatbot)
  - Time to first chatbot creation

- **Engagement**
  - Daily/Monthly active users (DAU/MAU)
  - Chatbots created per user
  - Messages processed per day
  - Average session duration

- **Retention**
  - Week 1/Week 4/Month 3 retention
  - Churn rate
  - Feature adoption rate

- **Revenue**
  - Monthly Recurring Revenue (MRR)
  - Average Revenue Per User (ARPU)
  - Conversion rate (free to paid)
  - Customer Lifetime Value (LTV)

### Technical Metrics
- **Performance**
  - API response time (p95, p99)
  - Widget load time
  - Page load time
  - Error rate

- **Reliability**
  - Uptime percentage (target: 99.9%)
  - Mean Time To Recovery (MTTR)
  - Incident count

- **Quality**
  - Test coverage (target: 80%)
  - Bug density
  - Critical bug resolution time

---

## 📝 Notes & Assumptions

### Assumptions
1. RAGFlow backend is available and properly documented
2. Stripe is the payment processor of choice
3. AWS/Vercel for hosting infrastructure
4. PostgreSQL for primary database
5. Redis for caching and session management

### Open Questions
- [ ] What is the RAGFlow API rate limit?
- [ ] What file size limits should we enforce?
- [ ] What is the maximum number of sources per chatbot?
- [ ] Do we need support for languages other than PT, EN, FR, ES?
- [ ] What is the data retention policy for conversations?
- [ ] Do we need GDPR compliance features?
- [ ] What is the backup and disaster recovery strategy?

### Future Considerations
- Voice-enabled chatbots
- Multi-channel support (WhatsApp, Telegram, Slack)
- AI training and fine-tuning capabilities
- Chatbot marketplace
- Pre-built chatbot templates
- Integration marketplace (Zapier, Make, etc.)

---

## 🔄 Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-11 | Product Team | Initial PRD creation |

---

**Last Updated:** 2025-10-11
**Next Review:** 2025-10-25
