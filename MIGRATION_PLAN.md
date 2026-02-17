# Migration Plan: Lit Frontend → Next.js

> **Status:** Planning Phase  
> **Target:** Complete migration to Next.js + React Query + Tailwind  
> **Source:** qr-code-frontend (Lit + Custom Router)  
> **Destination:** karsaaz Qr React js/  
> **Date:** 2026-02-17

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [Migration Strategy](#migration-strategy)
4. [Architecture Comparison](#architecture-comparison)
5. [Phase-by-Phase Plan](#phase-by-phase-plan)
6. [Module Migration Priority](#module-migration-priority)
7. [Technical Implementation Guide](#technical-implementation-guide)
8. [Risk Assessment](#risk-assessment)
9. [Success Criteria](#success-criteria)

---

## Executive Summary

### Current State
- **Framework:** Lit (Web Components)
- **Router:** Custom `qrcg-router` (event-driven)
- **State:** Local component state + events
- **Styling:** CSS + some component-scoped styles
- **API Client:** Custom fetch wrapper
- **Modules:** 30+ feature modules
- **Routes:** 50+ unique routes
- **API Endpoints:** 100+ endpoints

### Target State
- **Framework:** Next.js 14+ (App Router)
- **Router:** File-based routing (Next.js)
- **State:** React Query (TanStack Query v5)
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form + Zod
- **Auth:** NextAuth.js or custom JWT middleware
- **API Client:** Axios + React Query hooks

### Why Migrate?

**Benefits:**
1. ✅ **Better Developer Experience:** React ecosystem, TypeScript support, better tooling
2. ✅ **SEO & Performance:** SSR, SSG, ISR capabilities
3. ✅ **Modern State Management:** React Query handles caching, revalidation, optimistic updates
4. ✅ **Component Ecosystem:** Access to shadcn/ui, Radix UI, and thousands of React libraries
5. ✅ **Type Safety:** Better TypeScript integration
6. ✅ **Developer Pool:** Easier to hire React developers than Lit developers

**Challenges:**
1. ⚠️ Large codebase (30+ modules)
2. ⚠️ Custom router logic needs translation
3. ⚠️ Permission system migration
4. ⚠️ Testing during migration
5. ⚠️ Learning curve for team

---

## Technology Stack

### Core Framework
```json
{
  "framework": "Next.js 14+",
  "routing": "App Router (file-based)",
  "language": "TypeScript",
  "runtime": "Node.js 18+"
}
```

### UI & Styling
```json
{
  "styling": "Tailwind CSS v3+",
  "components": "shadcn/ui",
  "icons": "lucide-react",
  "animations": "framer-motion"
}
```

### State & Data Management
```json
{
  "server-state": "React Query (TanStack Query v5)",
  "forms": "React Hook Form v7",
  "validation": "Zod",
  "http-client": "Axios"
}
```

### Authentication & Authorization
```json
{
  "auth": "NextAuth.js v5 (Auth.js)",
  "token-storage": "HTTP-only cookies",
  "permissions": "Custom middleware + RBAC"
}
```

### Development Tools
```json
{
  "package-manager": "pnpm",
  "linting": "ESLint + Prettier",
  "type-checking": "TypeScript strict mode",
  "testing": "Vitest + React Testing Library"
}
```

---

## Migration Strategy

### Approach: **Big Bang Migration** (All at once, separate codebase)

**Rationale:**
- Clean slate allows for better architecture
- No need to maintain compatibility between old/new
- Can modernize structure without constraints
- Clear cutover point

### Alternative Considered: Incremental Migration
- ❌ Rejected: Too complex to run two frontends simultaneously
- ❌ Rejected: Shared backend would create deployment dependencies

### Execution Strategy

```
Phase 1: Foundation (2-3 weeks)
├── Project setup
├── Core infrastructure
├── Auth system
└── Shared components

Phase 2: Feature Migration (6-8 weeks)
├── Priority modules (QR Code, Account, Dashboard)
├── Secondary modules (Subscriptions, Payments, Users)
└── Tertiary modules (Content, Domains, Settings)

Phase 3: Testing & Deployment (2-3 weeks)
├── E2E testing
├── Performance optimization
├── Deployment setup
└── Documentation
```

---

## Architecture Comparison

### Old Architecture (Lit)

```
qr-code-frontend/
├── src/
│   ├── core/
│   │   ├── qrcg-router.js          ← Custom router
│   │   ├── api.js                  ← Custom fetch wrapper
│   │   ├── auth.js                 ← localStorage-based auth
│   │   └── qrcg-api-consumer.js    ← API state management
│   ├── [module-name]/
│   │   ├── router.js               ← Route definitions
│   │   ├── list-page.js            ← List component
│   │   ├── form-page.js            ← Form component
│   │   └── components/             ← Module-specific components
│   └── index.js                    ← Entry point
```

**Characteristics:**
- Event-driven router
- Imperative state management
- Manual loading states
- Manual error handling
- No SSR

### New Architecture (Next.js)

```
karsaaz-qr-nextjs/
├── app/
│   ├── (auth)/                     ← Auth routes group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/                ← Protected routes group
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── qrcodes/
│   │   │   ├── page.tsx            ← List page
│   │   │   ├── new/
│   │   │   │   └── page.tsx        ← Create page
│   │   │   └── [id]/
│   │   │       ├── page.tsx        ← View/Edit page
│   │   │       └── stats/
│   │   │           └── page.tsx    ← Stats page
│   │   └── layout.tsx              ← Dashboard layout + auth guard
│   ├── api/                        ← API routes (if needed)
│   ├── layout.tsx                  ← Root layout
│   └── page.tsx                    ← Home page
├── components/
│   ├── ui/                         ← shadcn/ui components
│   ├── forms/                      ← Reusable form components
│   ├── layouts/                    ← Layout components
│   └── modules/                    ← Feature-specific components
├── lib/
│   ├── api/
│   │   ├── client.ts               ← Axios instance
│   │   ├── hooks/                  ← React Query hooks
│   │   │   ├── useQRCodes.ts
│   │   │   ├── useAuth.ts
│   │   │   └── ...
│   │   └── endpoints/              ← API endpoint definitions
│   ├── auth/
│   │   ├── auth.ts                 ← Auth utilities
│   │   └── permissions.ts          ← Permission checking
│   ├── utils/                      ← Utility functions
│   └── validations/                ← Zod schemas
├── middleware.ts                   ← Auth middleware
├── types/                          ← TypeScript types
└── config/                         ← App configuration
```

**Characteristics:**
- File-based routing (automatic)
- Declarative state with React Query
- Automatic caching & revalidation
- Built-in error boundaries
- SSR/SSG support
- Route groups for organization
- Middleware for auth

---

## Phase-by-Phase Plan

### Phase 1: Foundation & Core Infrastructure (Weeks 1-3)

#### Week 1: Project Setup

**Day 1-2: Initialize Project**
```bash
npx create-next-app@latest karsaaz-qr-nextjs --typescript --tailwind --app --eslint
cd karsaaz-qr-nextjs
pnpm add @tanstack/react-query axios zod react-hook-form
pnpm add -D @tanstack/react-query-devtools
```

**Tasks:**
- [ ] Create Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up shadcn/ui
- [ ] Configure ESLint + Prettier
- [ ] Set up folder structure
- [ ] Configure environment variables
- [ ] Set up Git repository

**Deliverables:**
- ✅ Working Next.js app
- ✅ Tailwind configured
- ✅ Basic folder structure
- ✅ Environment setup

**Day 3-4: Core Infrastructure**

**Tasks:**
- [ ] Create Axios client (`lib/api/client.ts`)
- [ ] Set up React Query provider
- [ ] Create auth utilities (`lib/auth/`)
- [ ] Set up middleware for protected routes
- [ ] Create permission checking utilities
- [ ] Set up error handling (error boundaries)
- [ ] Create toast notification system

**Deliverables:**
- ✅ API client ready
- ✅ React Query configured
- ✅ Auth infrastructure
- ✅ Route protection

**Day 5: Base Components**

**Tasks:**
- [ ] Install shadcn/ui components (button, input, form, etc.)
- [ ] Create layout components (DashboardLayout, AuthLayout)
- [ ] Create loading states (Skeleton, Spinner)
- [ ] Create error components (ErrorBoundary, NotFound)
- [ ] Create breadcrumbs component
- [ ] Create table component (for list pages)

**Deliverables:**
- ✅ shadcn/ui components installed
- ✅ Reusable layout components
- ✅ Loading & error states

#### Week 2: Authentication System

**Tasks:**
- [ ] Implement login page (`app/(auth)/login/page.tsx`)
- [ ] Implement signup page
- [ ] Implement forgot password flow
- [ ] Implement email verification
- [ ] Create `useAuth` hook with React Query
- [ ] Implement token management (HTTP-only cookies or localStorage)
- [ ] Create auth middleware (`middleware.ts`)
- [ ] Implement logout functionality
- [ ] Create protected route HOC/wrapper
- [ ] OAuth integration (Google, if needed)

**API Endpoints Used:**
```typescript
// lib/api/hooks/useAuth.ts
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/verify-email
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
POST   /api/auth/logout
```

**Components to Create:**
- `LoginForm.tsx`
- `SignupForm.tsx`
- `ForgotPasswordForm.tsx`
- `ResetPasswordForm.tsx`
- `EmailVerification.tsx`
- `AuthLayout.tsx`

**Deliverables:**
- ✅ Complete auth flow
- ✅ Token management
- ✅ Route protection working
- ✅ OAuth working (if applicable)

#### Week 3: Dashboard & Core UI

**Tasks:**
- [ ] Create dashboard layout (`app/(dashboard)/layout.tsx`)
- [ ] Create sidebar navigation
- [ ] Create header/navbar
- [ ] Implement dashboard home page
- [ ] Create stats widgets
- [ ] Implement user profile page
- [ ] Create settings page
- [ ] Implement breadcrumb navigation
- [ ] Create mobile responsive navigation

**Components to Create:**
- `DashboardLayout.tsx`
- `Sidebar.tsx`
- `Header.tsx`
- `StatsCard.tsx`
- `UserProfileForm.tsx`
- `Breadcrumbs.tsx`

**Deliverables:**
- ✅ Dashboard shell complete
- ✅ Navigation working
- ✅ Responsive design
- ✅ User can access dashboard

---

### Phase 2: Feature Migration (Weeks 4-11)

#### Priority 1: Core Modules (Weeks 4-6)

##### Week 4: QR Code Module - Part 1 (List & View)

**Routes to Create:**
```
app/(dashboard)/qrcodes/
├── page.tsx                    ← List page
├── [id]/
│   └── page.tsx               ← View/Edit page
```

**Tasks:**
- [ ] Create QR codes list page with table
- [ ] Implement filtering & search
- [ ] Implement pagination
- [ ] Create `useQRCodes` hook (React Query)
- [ ] Create `useQRCode` hook (single QR code)
- [ ] Implement delete functionality
- [ ] Create QR code preview component
- [ ] Create folder management
- [ ] Create bulk actions (select multiple)

**API Hooks:**
```typescript
// lib/api/hooks/useQRCodes.ts
export function useQRCodes(filters?) {
  return useQuery({
    queryKey: ['qrcodes', filters],
    queryFn: () => api.get('/qrcodes', { params: filters })
  })
}

export function useDeleteQRCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/qrcodes/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['qrcodes'])
  })
}
```

**Components:**
- `QRCodeList.tsx`
- `QRCodeTable.tsx`
- `QRCodeFilters.tsx`
- `QRCodePreview.tsx`
- `DeleteQRCodeModal.tsx`
- `FolderSelector.tsx`

**Deliverables:**
- ✅ QR codes list working
- ✅ Search & filter functional
- ✅ Delete working with optimistic updates
- ✅ Pagination working

##### Week 5: QR Code Module - Part 2 (Create & Edit)

**Routes to Create:**
```
app/(dashboard)/qrcodes/
├── new/
│   └── page.tsx               ← Create page
└── [id]/
    └── edit/
        └── page.tsx           ← Edit page
```

**Tasks:**
- [ ] Create QR code form (React Hook Form + Zod)
- [ ] Implement QR type selector
- [ ] Create dynamic form fields based on type
- [ ] Implement file upload (logo, webpage design)
- [ ] Create QR preview with live updates
- [ ] Implement `useCreateQRCode` mutation
- [ ] Implement `useUpdateQRCode` mutation
- [ ] Create validation schemas (Zod)
- [ ] Implement QR code customization (colors, styles)
- [ ] Create template selector

**API Hooks:**
```typescript
export function useCreateQRCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/qrcodes', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['qrcodes'])
      toast.success('QR Code created!')
    }
  })
}

export function useQRCodePreview() {
  return useMutation({
    mutationFn: (data) => api.post('/qrcodes/preview', data)
  })
}
```

**Zod Validation:**
```typescript
// lib/validations/qrcode.ts
export const qrcodeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['url', 'vcard', 'email', 'sms', ...]),
  content: z.object({
    // Dynamic based on type
  }),
  design: z.object({
    foreground: z.string(),
    background: z.string(),
    // ...
  }).optional()
})
```

**Components:**
- `QRCodeForm.tsx`
- `QRCodeTypeSelector.tsx`
- `QRCodeContentFields.tsx` (dynamic)
- `QRCodeDesignCustomizer.tsx`
- `QRCodePreviewLive.tsx`
- `FileUploadZone.tsx`
- `TemplateSelector.tsx`

**Deliverables:**
- ✅ Create QR code working
- ✅ Edit QR code working
- ✅ Form validation working
- ✅ Live preview functional
- ✅ File uploads working

##### Week 6: QR Code Module - Part 3 (Stats & Bulk Operations)

**Routes to Create:**
```
app/(dashboard)/qrcodes/
├── [id]/
│   └── stats/
│       └── page.tsx           ← Stats page
└── bulk/
    └── page.tsx               ← Bulk operations
```

**Tasks:**
- [ ] Create QR code stats page
- [ ] Implement scan history chart
- [ ] Create geographic distribution map
- [ ] Implement device/browser analytics
- [ ] Create bulk import page (CSV/URLs)
- [ ] Implement bulk export
- [ ] Implement bulk delete
- [ ] Create `useQRCodeStats` hook
- [ ] Create date range selector
- [ ] Implement real-time stats (if needed)

**API Hooks:**
```typescript
export function useQRCodeStats(id: string, dateRange?) {
  return useQuery({
    queryKey: ['qrcode-stats', id, dateRange],
    queryFn: () => api.get(`/qrcodes/${id}/stats`, {
      params: dateRange
    }),
    refetchInterval: 30000 // Refresh every 30s
  })
}

export function useBulkImportQRCodes() {
  return useMutation({
    mutationFn: (file) => {
      const formData = new FormData()
      formData.append('file', file)
      return api.post('/qrcodes/bulk-import-urls', formData)
    }
  })
}
```

**Components:**
- `QRCodeStats.tsx`
- `ScanHistoryChart.tsx` (recharts/visx)
- `GeographicMap.tsx`
- `DeviceAnalytics.tsx`
- `BulkImportForm.tsx`
- `BulkExportDialog.tsx`
- `DateRangePicker.tsx`

**Deliverables:**
- ✅ Stats page with charts
- ✅ Bulk operations working
- ✅ Export functionality
- ✅ Import validation

#### Priority 2: Account & Dashboard (Week 7)

**Routes:**
```
app/(dashboard)/
├── dashboard/
│   └── page.tsx               ← Home dashboard
├── account/
│   ├── profile/
│   │   └── page.tsx
│   ├── security/
│   │   └── page.tsx
│   └── upgrade/
│       └── page.tsx
```

**Tasks:**
- [ ] Dashboard home with stats
- [ ] Recent QR codes widget
- [ ] User profile management
- [ ] Password change
- [ ] Account upgrade page
- [ ] Subscription management

**Components:**
- `DashboardHome.tsx`
- `RecentQRCodesWidget.tsx`
- `ProfileForm.tsx`
- `ChangePasswordForm.tsx`
- `UpgradePlans.tsx`

#### Priority 3: Subscriptions & Payments (Week 8)

**Routes:**
```
app/(dashboard)/
├── subscriptions/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
├── checkout/
│   └── page.tsx
└── billing/
    └── page.tsx
```

**Tasks:**
- [ ] Subscription list & management
- [ ] Checkout flow
- [ ] Payment integration (Stripe)
- [ ] Billing history
- [ ] Invoice download
- [ ] Payment method management

**API Hooks:**
```typescript
export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => api.get('/subscriptions')
  })
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (planId) => api.post('/checkout/process', { planId })
  })
}
```

**Components:**
- `SubscriptionList.tsx`
- `SubscriptionCard.tsx`
- `CheckoutForm.tsx`
- `StripeElements.tsx`
- `BillingHistory.tsx`
- `InvoiceDownload.tsx`

#### Priority 4: User Management (Week 9)

**Routes:**
```
app/(dashboard)/users/
├── page.tsx
├── new/
│   └── page.tsx
└── [id]/
    └── page.tsx
```

**Tasks:**
- [ ] Users list (admin only)
- [ ] Create user
- [ ] Edit user
- [ ] Role assignment
- [ ] Permission management
- [ ] User status management

**Components:**
- `UsersList.tsx`
- `UserForm.tsx`
- `RoleSelector.tsx`
- `PermissionsMatrix.tsx`

#### Priority 5: Secondary Modules (Weeks 10-11)

**Modules to Migrate:**
- Blog Posts
- Content Blocks
- Pages
- Domains
- Currencies
- Custom Code
- Lead Forms
- Translations
- Payment Gateways
- Subscription Plans
- Transactions

**Approach:**
Each module follows the same pattern:
1. Create routes (list, create, edit)
2. Create API hooks (useModule, useCreateModule, etc.)
3. Create components (List, Form, Delete modal)
4. Implement validation (Zod schemas)
5. Test CRUD operations

**Template Structure:**
```typescript
// Example: Blog Posts
app/(dashboard)/blog-posts/
├── page.tsx                    ← List
├── new/page.tsx               ← Create
└── [id]/page.tsx              ← Edit

lib/api/hooks/useBlogPosts.ts
lib/validations/blogPost.ts
components/modules/blog-posts/
├── BlogPostList.tsx
├── BlogPostForm.tsx
└── DeleteBlogPostModal.tsx
```

---

### Phase 3: Testing, Optimization & Deployment (Weeks 12-14)

#### Week 12: Testing

**Tasks:**
- [ ] Unit tests for API hooks (Vitest)
- [ ] Component tests (React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Integration tests
- [ ] Permission testing
- [ ] Error handling tests
- [ ] Form validation tests

**Test Coverage Goals:**
- API Hooks: 90%+
- Components: 80%+
- E2E: Critical paths covered

#### Week 13: Performance Optimization

**Tasks:**
- [ ] Implement React Query caching strategies
- [ ] Add prefetching for common routes
- [ ] Optimize images (next/image)
- [ ] Implement lazy loading
- [ ] Add loading skeletons
- [ ] Optimize bundle size
- [ ] Enable SSR where beneficial
- [ ] Add ISR for public pages
- [ ] Implement code splitting
- [ ] Add monitoring (Vercel Analytics or similar)

**Performance Metrics:**
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse score > 90

#### Week 14: Deployment & Documentation

**Tasks:**
- [ ] Set up production environment
- [ ] Configure CI/CD (GitHub Actions)
- [ ] Set up error tracking (Sentry)
- [ ] Set up monitoring
- [ ] Create deployment guide
- [ ] Update README
- [ ] Create developer documentation
- [ ] Create user guide
- [ ] Conduct final testing
- [ ] Deploy to production
- [ ] Monitor post-deployment

**Documentation:**
- Architecture overview
- Component documentation
- API hooks documentation
- Deployment guide
- Environment variables guide
- Testing guide

---

## Module Migration Priority

### Tier 1: Critical (Weeks 4-7)
These modules are essential for basic functionality:

1. **QR Code Module** ⭐⭐⭐
   - Core business logic
   - Most complex module
   - Priority: HIGHEST

2. **Account Module** ⭐⭐⭐
   - Authentication required for everything
   - User profile management
   - Priority: HIGHEST

3. **Dashboard** ⭐⭐⭐
   - Landing page after login
   - Overview of all activities
   - Priority: HIGHEST

### Tier 2: Important (Weeks 8-9)
These enable monetization and user management:

4. **Subscriptions** ⭐⭐
   - Business model enabler
   - Priority: HIGH

5. **Checkout & Payments** ⭐⭐
   - Revenue generation
   - Priority: HIGH

6. **Users Management** ⭐⭐
   - Admin functionality
   - Priority: HIGH

7. **Billing** ⭐⭐
   - Invoice management
   - Priority: HIGH

### Tier 3: Standard (Weeks 10-11)
These are standard CRUD modules:

8. **Subscription Plans**
9. **Payment Gateways**
10. **Transactions**
11. **Blog Posts**
12. **Content Blocks**
13. **Pages**
14. **Domains**
15. **Lead Forms**

### Tier 4: Administrative (Week 11)
These are system/admin features:

16. **Currencies**
17. **Custom Code**
18. **Translations**
19. **System Settings**
20. **Roles & Permissions**
21. **Template Categories**

### Tier 5: Advanced (Week 11)
22. **Bulk Operations**
23. **Plugins**
24. **QR Templates**
25. **Cloud Storage**
26. **Dynamic Biolink Blocks**
27. **Support Tickets**
28. **Referral System**

---

## Technical Implementation Guide

### 1. Setting Up React Query

**Provider Setup:**
```typescript
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: (error) => {
          // Global error handling
          console.error(error)
        }
      }
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

**Root Layout:**
```typescript
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### 2. API Client Setup

**Axios Instance:**
```typescript
// lib/api/client.ts
import axios from 'axios'
import { getToken, refreshToken, logout } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 - Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const newToken = await refreshToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch {
        logout()
        window.location.href = '/login'
      }
    }

    // Handle validation errors
    if (error.response?.data?.validationErrors) {
      return Promise.reject({
        type: 'validation',
        errors: error.response.data.validationErrors
      })
    }

    return Promise.reject(error)
  }
)
```

### 3. React Query Hooks Pattern

**Example: QR Codes**
```typescript
// lib/api/hooks/useQRCodes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import type { QRCode, QRCodeFilters, CreateQRCodeData } from '@/types/qrcode'

// Query Keys (for cache management)
export const qrcodeKeys = {
  all: ['qrcodes'] as const,
  lists: () => [...qrcodeKeys.all, 'list'] as const,
  list: (filters?: QRCodeFilters) => [...qrcodeKeys.lists(), filters] as const,
  details: () => [...qrcodeKeys.all, 'detail'] as const,
  detail: (id: string) => [...qrcodeKeys.details(), id] as const,
  stats: (id: string) => [...qrcodeKeys.detail(id), 'stats'] as const,
}

// List QR Codes
export function useQRCodes(filters?: QRCodeFilters) {
  return useQuery({
    queryKey: qrcodeKeys.list(filters),
    queryFn: async () => {
      const data = await apiClient.get<QRCode[]>('/qrcodes', {
        params: filters
      })
      return data
    },
  })
}

// Get Single QR Code
export function useQRCode(id: string) {
  return useQuery({
    queryKey: qrcodeKeys.detail(id),
    queryFn: async () => {
      const data = await apiClient.get<QRCode>(`/qrcodes/${id}`)
      return data
    },
    enabled: !!id, // Only run if id exists
  })
}

// Create QR Code
export function useCreateQRCode() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateQRCodeData) => {
      return await apiClient.post<QRCode>('/qrcodes', data)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.lists() })
    },
  })
}

// Update QR Code
export function useUpdateQRCode() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<QRCode> }) => {
      return await apiClient.put<QRCode>(`/qrcodes/${id}`, data)
    },
    onSuccess: (data, { id }) => {
      // Update cache optimistically
      queryClient.setQueryData(qrcodeKeys.detail(id), data)
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.lists() })
    },
  })
}

// Delete QR Code
export function useDeleteQRCode() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/qrcodes/${id}`)
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: qrcodeKeys.lists() })
      
      // Snapshot previous value
      const previousQRCodes = queryClient.getQueryData(qrcodeKeys.lists())
      
      // Optimistically update
      queryClient.setQueriesData(
        { queryKey: qrcodeKeys.lists() },
        (old: QRCode[] | undefined) => {
          return old?.filter(qr => qr.id !== id) ?? []
        }
      )
      
      return { previousQRCodes }
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousQRCodes) {
        queryClient.setQueryData(qrcodeKeys.lists(), context.previousQRCodes)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.lists() })
    },
  })
}

// QR Code Stats
export function useQRCodeStats(id: string, dateRange?: { from: Date; to: Date }) {
  return useQuery({
    queryKey: qrcodeKeys.stats(id),
    queryFn: async () => {
      return await apiClient.get(`/qrcodes/${id}/stats`, {
        params: dateRange
      })
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: !!id,
  })
}
```

### 4. Form Handling with React Hook Form + Zod

**Example: QR Code Form**
```typescript
// lib/validations/qrcode.ts
import { z } from 'zod'

export const qrcodeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  type: z.enum(['url', 'vcard', 'email', 'sms', 'wifi', 'text']),
  folder_id: z.string().optional(),
  content: z.object({
    url: z.string().url().optional(),
    text: z.string().optional(),
    // ... dynamic based on type
  }),
  design: z.object({
    foreground_color: z.string().regex(/^#[0-9A-F]{6}$/i),
    background_color: z.string().regex(/^#[0-9A-F]{6}$/i),
    logo: z.string().optional(),
    frame: z.string().optional(),
  }).optional(),
})

export type QRCodeFormData = z.infer<typeof qrcodeSchema>
```

**Form Component:**
```typescript
// components/modules/qrcodes/QRCodeForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { qrcodeSchema, type QRCodeFormData } from '@/lib/validations/qrcode'
import { useCreateQRCode, useUpdateQRCode } from '@/lib/api/hooks/useQRCodes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface QRCodeFormProps {
  initialData?: QRCodeFormData
  mode: 'create' | 'edit'
  id?: string
}

export function QRCodeForm({ initialData, mode, id }: QRCodeFormProps) {
  const router = useRouter()
  const createMutation = useCreateQRCode()
  const updateMutation = useUpdateQRCode()
  
  const form = useForm<QRCodeFormData>({
    resolver: zodResolver(qrcodeSchema),
    defaultValues: initialData || {
      name: '',
      type: 'url',
      content: {},
      design: {
        foreground_color: '#000000',
        background_color: '#FFFFFF',
      }
    },
  })

  const onSubmit = async (data: QRCodeFormData) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data)
        toast.success('QR Code created successfully!')
      } else {
        await updateMutation.mutateAsync({ id: id!, data })
        toast.success('QR Code updated successfully!')
      }
      router.push('/dashboard/qrcodes')
    } catch (error: any) {
      if (error.type === 'validation') {
        // Set server validation errors
        Object.entries(error.errors).forEach(([field, message]) => {
          form.setError(field as any, { message: message as string })
        })
      } else {
        toast.error('An error occurred. Please try again.')
      }
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>QR Code Name</FormLabel>
              <FormControl>
                <Input placeholder="My QR Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>QR Code Type</FormLabel>
              <FormControl>
                <select {...field} className="w-full border rounded p-2">
                  <option value="url">URL</option>
                  <option value="vcard">vCard</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="wifi">WiFi</option>
                  <option value="text">Text</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dynamic content fields based on type */}
        {/* ... */}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

### 5. Protected Routes with Middleware

**Middleware:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from './lib/auth/server'

export async function middleware(request: NextRequest) {
  const token = await getToken(request)
  const { pathname } = request.nextUrl

  // Public routes
  const isPublicRoute = pathname.startsWith('/login') || 
                        pathname.startsWith('/signup') ||
                        pathname.startsWith('/forgot-password')

  // Protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard') ||
                          pathname.startsWith('/account')

  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Permission Check:**
```typescript
// lib/auth/permissions.ts
import { useAuth } from '@/lib/api/hooks/useAuth'

export function usePermissions() {
  const { data: user } = useAuth()
  
  const hasPermission = (permission: string): boolean => {
    if (!user?.permissions) return false
    return user.permissions.includes(permission)
  }
  
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(hasPermission)
  }
  
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(hasPermission)
  }
  
  return { hasPermission, hasAnyPermission, hasAllPermissions }
}

// Usage in components
export function ProtectedComponent() {
  const { hasPermission } = usePermissions()
  
  if (!hasPermission('qrcode.store')) {
    return <div>Access Denied</div>
  }
  
  return <div>Protected Content</div>
}
```

### 6. Error Handling

**Error Boundary:**
```typescript
// components/ErrorBoundary.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
```

**Error Page:**
```typescript
// app/error.tsx
'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'

export default ErrorBoundary
```

---

## Risk Assessment

### High Risk Items

1. **Data Migration**
   - Risk: Data loss or corruption during migration
   - Mitigation: Thorough testing, backup strategies, rollback plan

2. **Authentication Breaking**
   - Risk: Users locked out after migration
   - Mitigation: Maintain backward compatibility with tokens, gradual rollout

3. **Permission System Changes**
   - Risk: Users accessing unauthorized content
   - Mitigation: Comprehensive permission testing, security audit

4. **Performance Degradation**
   - Risk: Slower than old frontend
   - Mitigation: Performance testing, React Query caching, SSR/SSG

5. **Third-party Integration Failures**
   - Risk: Stripe, OAuth providers fail
   - Mitigation: Integration testing, fallback mechanisms

### Medium Risk Items

1. **Learning Curve**
   - Risk: Team unfamiliar with Next.js/React Query
   - Mitigation: Training, documentation, pair programming

2. **Feature Parity**
   - Risk: Missing features from old frontend
   - Mitigation: Feature checklist, thorough QA

3. **Browser Compatibility**
   - Risk: Issues in specific browsers
   - Mitigation: Cross-browser testing

### Low Risk Items

1. **Styling Inconsistencies**
   - Risk: UI doesn't match old design
   - Mitigation: Tailwind makes this easy to fix

2. **Build Failures**
   - Risk: Production build fails
   - Mitigation: CI/CD catches early

---

## Success Criteria

### Functionality
- ✅ 100% feature parity with old frontend
- ✅ All 30+ modules migrated and working
- ✅ All CRUD operations functional
- ✅ Authentication & authorization working
- ✅ Payment processing functional
- ✅ File uploads working

### Performance
- ✅ Lighthouse score > 90
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s
- ✅ No regression in API response times

### Quality
- ✅ Test coverage > 80%
- ✅ Zero critical bugs in production
- ✅ All TypeScript errors resolved
- ✅ Accessibility (WCAG 2.1 AA)

### User Experience
- ✅ Mobile responsive
- ✅ Intuitive navigation
- ✅ Fast page transitions
- ✅ Clear error messages
- ✅ Loading states for all async operations

### Developer Experience
- ✅ Clear documentation
- ✅ Easy to add new modules
- ✅ Good TypeScript support
- ✅ Fast dev server startup

---

## Next Steps

### Immediate Actions (This Week)

1. **Review & Approve Plan**
   - [ ] Team review of migration plan
   - [ ] Stakeholder approval
   - [ ] Resource allocation

2. **Create ADR**
   - [ ] Document architecture decisions
   - [ ] Technology stack rationale
   - [ ] Trade-offs analysis

3. **Set Up Project**
   - [ ] Initialize Next.js project
   - [ ] Set up Git repository
   - [ ] Configure CI/CD pipeline

4. **Kickoff Meeting**
   - [ ] Align team on approach
   - [ ] Assign responsibilities
   - [ ] Set up communication channels

### Week 1 Tasks

See [Phase 1: Foundation](#phase-1-foundation--core-infrastructure-weeks-1-3) for detailed week 1 tasks.

---

## Appendix

### Technology Stack Comparison

| Aspect | Old (Lit) | New (Next.js) |
|--------|----------|---------------|
| Framework | Lit 2.x | Next.js 14+ |
| Language | JavaScript | TypeScript |
| Routing | Custom | File-based |
| State | Local + Events | React Query |
| Styling | CSS | Tailwind CSS |
| Forms | Manual | React Hook Form + Zod |
| Testing | ? | Vitest + RTL + Playwright |
| SSR | No | Yes |
| Bundle Size | Small | Medium (but with SSR) |
| Dev Experience | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Learning Curve | Medium | Low (React is common) |

### Resources

**Documentation:**
- Next.js: https://nextjs.org/docs
- React Query: https://tanstack.com/query/latest
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev

**Community:**
- Next.js Discord
- React Query Discord
- Stack Overflow

---

**Last Updated:** 2026-02-17  
**Status:** Planning Phase  
**Owner:** Development Team
