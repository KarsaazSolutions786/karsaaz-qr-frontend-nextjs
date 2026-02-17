<!--
SYNC IMPACT REPORT
Version: 1.0.0 (Initial Constitution)
Date: 2026-02-17
Changes:
  - Initial constitution created for Karsaaz QR Next.js project
  - 8 core principles established
  - Governance framework defined
  - Migration-specific guidelines integrated
Templates:
  - ✅ Constitution created
  - ⚠ Plan template - to be created
  - ⚠ Spec template - to be created
  - ⚠ Tasks template - to be created
-->

# Project Constitution

**Project Name:** Karsaaz QR Next.js Frontend  
**Version:** 1.0.0  
**Ratification Date:** 2026-02-17  
**Last Amended:** 2026-02-17  
**Status:** Active

---

## Preamble

This constitution establishes the foundational principles, architectural standards, and governance rules for the Karsaaz QR Next.js frontend application. This project migrates a Lit Web Components-based QR code management system to a modern Next.js 14+ stack with React Query, Tailwind CSS, and TypeScript.

**Project Vision:**  
Build a fast, maintainable, type-safe, and user-friendly QR code management platform that leverages modern React ecosystem best practices while maintaining 100% feature parity with the legacy system.

**Scope:**  
30+ feature modules, 50+ routes, 100+ API endpoints, enterprise-grade authentication, payment processing, and admin management capabilities.

---

## Core Principles

### Principle 1: Type Safety First

**Rule:** All code MUST be written in TypeScript with strict mode enabled. No `any` types except in explicitly justified legacy integration points.

**Requirements:**
- TypeScript strict mode enabled in `tsconfig.json`
- All API responses MUST have defined interfaces/types
- Zod schemas MUST validate all external data (forms, API responses)
- React components MUST have explicitly typed props
- No type assertions (`as`) without documented justification

**Rationale:**  
Type safety catches 80% of bugs at compile time, improves IDE autocomplete, and serves as living documentation. The legacy Lit system lacked type safety—this is a key improvement.

**Enforcement:**  
- TypeScript compiler with `strict: true` and `noImplicitAny: true`
- Pre-commit hooks run `tsc --noEmit`
- CI/CD pipeline fails on TypeScript errors
- Code reviews reject PRs with unjustified `any` types

---

### Principle 2: Server State Belongs to React Query

**Rule:** All server state (API data, caching, synchronization) MUST be managed through React Query (TanStack Query). Local UI state uses React hooks.

**Requirements:**
- API calls MUST use React Query hooks (`useQuery`, `useMutation`)
- No manual `useState` for server data (fetched data, loading states, errors)
- Query keys MUST follow the standardized hierarchy: `['resource', id, 'sub-resource']`
- Mutations MUST invalidate related queries for consistency
- Stale time and cache time configured per resource type

**Rationale:**  
React Query eliminates 90% of state management boilerplate, provides automatic caching, background refetching, optimistic updates, and request deduplication. The legacy system manually managed all this—React Query handles it better.

**Enforcement:**
- ESLint rule bans `useState` with `fetch`/`axios` calls
- Code reviews verify query key consistency
- Required: mutation success callbacks invalidate queries
- React Query DevTools enabled in development

**Exceptions:**  
Form state (use React Hook Form), UI toggles (modals, dropdowns), temporary input values.

---

### Principle 3: Component Architecture & Composition

**Rule:** Components MUST follow a clear hierarchy: Pages → Features → UI Components. shadcn/ui provides the base UI layer.

**Structure:**
```
app/
  ├── (auth)/           # Route groups for layouts
  ├── dashboard/        # Pages (route handlers)
components/
  ├── features/         # Feature-specific components (QRCodeForm, DomainManager)
  ├── ui/               # shadcn/ui components (Button, Dialog, Table)
  └── layout/           # Layout components (Header, Sidebar, Footer)
```

**Requirements:**
- Pages (`app/` directory) MUST only handle routing, data fetching, and layout
- Feature components MUST be self-contained with clear props interfaces
- UI components (shadcn/ui) MUST NOT contain business logic
- Maximum component file size: 300 lines (split if exceeded)
- One component per file (named exports only)

**Rationale:**  
Clear separation of concerns makes code navigable, testable, and reusable. The legacy system mixed routing, logic, and UI in Web Components—this is cleaner.

**Enforcement:**
- File size linting rule (max 300 lines)
- Code reviews enforce separation of concerns
- No business logic allowed in `components/ui/`

---

### Principle 4: Authentication & Authorization Consistency

**Rule:** Authentication MUST use JWT tokens with Next.js middleware for route protection. Permissions checked server-side and client-side.

**Requirements:**
- JWT tokens stored in httpOnly cookies (not localStorage)
- Middleware validates tokens on protected routes
- Permission checks use centralized `hasPermission(user, permission)` utility
- Route protection via Next.js middleware (no client-side redirects for auth)
- API calls include Bearer token from server-side context

**Permissions Schema:**
```typescript
// Must match backend permission system exactly
type Permission = 
  | 'qrcode.list' 
  | 'qrcode.create' 
  | 'qrcode.update' 
  | 'qrcode.delete'
  | 'user.manage' 
  | 'admin.access'
  // ... (full list in types/permissions.ts)
```

**Rationale:**  
Security cannot be an afterthought. Consistent auth patterns prevent vulnerabilities. The legacy system had permission checks—we maintain that security model.

**Enforcement:**
- Middleware MUST verify JWT on every protected route
- API routes MUST validate permissions server-side
- Code reviews verify no client-side-only auth checks
- Security audits quarterly

---

### Principle 5: API Integration Standards

**Rule:** All backend communication MUST use the centralized Axios instance with interceptors for auth, error handling, and retries.

**Requirements:**
- Single Axios instance in `lib/api/client.ts`
- Request interceptor adds Bearer token
- Response interceptor handles 401 (logout), 403 (permission denied), 422 (validation errors)
- Retry logic with exponential backoff (3 attempts, 1s/2s/4s delays)
- Timeout configuration per endpoint type (60s default, 120s heavy, 180s uploads)
- All endpoints defined in `lib/api/endpoints/` by resource type

**Endpoint Organization:**
```typescript
// lib/api/endpoints/qrcodes.ts
export const qrcodesApi = {
  list: (params) => apiClient.get('/qrcodes', { params }),
  create: (data) => apiClient.post('/qrcodes', data),
  update: (id, data) => apiClient.put(`/qrcodes/${id}`, data),
  delete: (id) => apiClient.delete(`/qrcodes/${id}`),
  changeType: (id, type) => apiClient.post(`/qrcodes/${id}/change-type`, { type }),
}
```

**Rationale:**  
Centralized API logic prevents duplication, ensures consistent error handling, and makes debugging easier. The legacy system had this—we maintain it with TypeScript improvements.

**Enforcement:**
- ESLint rule prevents direct `fetch`/`axios` calls (must use `apiClient`)
- Code reviews verify endpoint definitions in `lib/api/endpoints/`
- Required: error handling for all API calls

---

### Principle 6: Form Handling & Validation

**Rule:** All forms MUST use React Hook Form with Zod validation schemas. No manual form state management.

**Requirements:**
- React Hook Form for all forms (useForm hook)
- Zod schemas define validation rules (co-located with forms or in `lib/validations/`)
- Server validation errors mapped to form fields
- Optimistic updates for mutations
- Loading states and disabled buttons during submission
- Toast notifications for success/error feedback

**Pattern:**
```typescript
// schemas/qrcode.ts
export const qrcodeSchema = z.object({
  name: z.string().min(1, "Name required").max(100),
  type: z.enum(['url', 'vcard', 'wifi', ...]),
  url: z.string().url().optional(),
  // ...
})

// Component
const form = useForm<z.infer<typeof qrcodeSchema>>({
  resolver: zodResolver(qrcodeSchema),
  defaultValues: initialData,
})

const mutation = useMutation({
  mutationFn: qrcodesApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries(['qrcodes'])
    toast.success("QR code created!")
  },
  onError: (error) => {
    if (error.validation) {
      // Map server errors to form fields
      Object.entries(error.validation).forEach(([field, message]) => {
        form.setError(field, { message })
      })
    }
  },
})
```

**Rationale:**  
React Hook Form is performant (no re-renders on every keystroke), Zod provides type-safe validation, and this pattern eliminates boilerplate while maintaining consistency.

**Enforcement:**
- ESLint rule requires Zod resolver for all forms
- Code reviews verify error handling and optimistic updates
- Required: loading states and success/error feedback

---

### Principle 7: Testing Discipline

**Rule:** Critical paths MUST have test coverage. Unit tests for logic, integration tests for features, E2E tests for user flows.

**Coverage Requirements:**
- **Unit Tests:** All utility functions, validation schemas, API endpoint wrappers (>80% coverage)
- **Integration Tests:** Feature components (form submissions, data display) (>70% coverage)
- **E2E Tests:** Critical user flows (login, create QR code, checkout) (100% of critical paths)

**Tools:**
- **Vitest:** Unit and integration tests
- **React Testing Library:** Component tests
- **Playwright:** E2E tests
- **MSW (Mock Service Worker):** API mocking in tests

**Test Structure:**
```
__tests__/
  ├── unit/          # Pure functions, utilities
  ├── integration/   # Components, hooks
  └── e2e/           # Full user flows (Playwright)
```

**Required Tests:**
- Authentication flows (login, signup, password reset)
- QR code CRUD operations
- Payment processing
- Permission-based access
- Form validation (client and server errors)

**Rationale:**  
The legacy system lacked comprehensive tests—this led to regressions. Testing is non-negotiable for maintainability and confidence in changes.

**Enforcement:**
- CI/CD fails if coverage drops below thresholds
- Code reviews require tests for new features
- E2E tests run before every deployment
- Weekly test report reviews

---

### Principle 8: Performance & User Experience

**Rule:** Page load times MUST meet performance budgets. Lighthouse score >90 on all critical pages.

**Performance Budgets:**
- **First Contentful Paint (FCP):** <1.5s
- **Largest Contentful Paint (LCP):** <2.5s
- **Time to Interactive (TTI):** <3.5s
- **Cumulative Layout Shift (CLS):** <0.1
- **Bundle Size (First Load JS):** <200KB (gzip)

**Required Optimizations:**
- Next.js Image component for all images (`next/image`)
- Dynamic imports for code splitting (`next/dynamic`)
- React Query stale time configured (reduce unnecessary refetches)
- Debounced search inputs (300ms delay)
- Virtualized lists for >100 items (TanStack Virtual)
- Lazy loading for off-screen content

**Monitoring:**
- Lighthouse CI in pipeline (fails if score <90)
- Sentry for error tracking and performance monitoring
- Web Vitals reporting to analytics
- Bundle size tracking (fail CI if >200KB increase without justification)

**Rationale:**  
User experience is a competitive advantage. Fast apps retain users. Performance budgets prevent degradation over time.

**Enforcement:**
- CI/CD pipeline runs Lighthouse on every PR
- Code reviews flag performance anti-patterns
- Monthly performance audits
- Required: dynamic imports for modals/heavy components

---

## Governance

### Amendment Procedure

1. **Proposal:** Any team member can propose amendments via written proposal
2. **Discussion:** Team discusses in architecture review meeting
3. **Vote:** Majority approval required (>50% of core team)
4. **Documentation:** Update this document with version bump
5. **Communication:** Announce changes to all team members

### Versioning Policy

**Semantic Versioning (MAJOR.MINOR.PATCH):**

- **MAJOR:** Breaking changes to principles (e.g., switching from React Query to Redux—would require re-vote)
- **MINOR:** New principle added or significant expansion of existing principle
- **PATCH:** Clarifications, wording improvements, typo fixes

**Version History:**
- `1.0.0` (2026-02-17): Initial constitution

### Compliance & Review

**Code Reviews:**
- Every PR MUST be reviewed by at least 1 other developer
- Reviewers MUST verify adherence to constitutional principles
- Violations MUST be addressed before merge

**Automated Checks (CI/CD):**
- TypeScript strict mode compilation (Principle 1)
- ESLint rules enforcing React Query patterns (Principle 2)
- Test coverage thresholds (Principle 7)
- Lighthouse performance scores (Principle 8)
- Bundle size limits (Principle 8)

**Periodic Reviews:**
- **Weekly:** Test coverage reports, performance dashboards
- **Monthly:** Architecture review meeting, principle adherence audit
- **Quarterly:** Security audit, dependency updates, constitution review

**Exceptions:**
- Exceptions to principles MUST be documented in code comments with `// CONSTITUTIONAL EXCEPTION: [reason]`
- Exceptions require approval from 2+ senior developers
- Exceptions reviewed in monthly architecture meetings

---

## Architectural Constraints

### Technology Stack (Locked)

These technologies are constitutional and MUST NOT be changed without a MAJOR version amendment:

| Category | Technology | Justification |
|----------|-----------|---------------|
| **Framework** | Next.js 14+ (App Router) | SSR/SSG, React Server Components, best ecosystem |
| **Language** | TypeScript (strict) | Type safety, developer experience |
| **Styling** | Tailwind CSS | Utility-first, rapid development, consistent design |
| **Components** | shadcn/ui | Accessible, customizable, Tailwind-native |
| **State (Server)** | React Query (TanStack Query) | Perfect for server state, caching, refetching |
| **State (Local)** | React hooks (useState, useReducer) | Native, simple, no over-engineering |
| **Forms** | React Hook Form + Zod | Performance, type-safe validation |
| **HTTP Client** | Axios | Interceptors, timeout config, retry logic |
| **Testing** | Vitest + RTL + Playwright | Fast, modern, comprehensive |

**Rationale:** These choices were made after architectural analysis (see MIGRATION_PLAN.md). Changing core technologies would invalidate the migration plan and require re-planning.

### Folder Structure (Standard)

```
app/                      # Next.js App Router (pages and routes)
  ├── (auth)/            # Auth route group (login, signup, etc.)
  ├── dashboard/         # Protected dashboard routes
  ├── api/               # API routes (server-side)
  └── layout.tsx         # Root layout
components/
  ├── features/          # Feature-specific components
  ├── ui/                # shadcn/ui base components
  └── layout/            # Layout components
lib/
  ├── api/               # API client, endpoints, types
  ├── hooks/             # Custom React hooks
  ├── utils/             # Utility functions
  └── validations/       # Zod schemas
types/                   # TypeScript type definitions
public/                  # Static assets
__tests__/               # Test files
```

**Enforcement:**  
ESLint import rules enforce folder structure. Code reviews reject misplaced files.

---

## Migration-Specific Rules

### Feature Parity Requirement

**Rule:** The Next.js app MUST maintain 100% feature parity with the legacy Lit system before launch.

**Verification:**
- Checklist in `MIGRATION_CHECKLIST.md` tracks all 30+ modules
- Each module MUST be tested against legacy system
- QA team verifies feature parity before module marked "complete"

### API Compatibility

**Rule:** API endpoints and request/response formats MUST remain compatible with the existing backend during migration.

**Requirements:**
- No breaking changes to API contracts
- Same authentication mechanism (JWT Bearer tokens)
- Same permission model (maintain permission keys)
- Response types MUST match exactly (use Zod to enforce)

**Rationale:**  
Backend and frontend migrate independently. API compatibility ensures smooth rollout.

### Progressive Enhancement

**Rule:** Core functionality MUST work without JavaScript (where feasible). Use Next.js SSR/SSG for progressive enhancement.

**Examples:**
- QR code list page renders server-side (users see data even if JS fails)
- Forms use Next.js Server Actions when possible
- Error pages render server-side

**Rationale:**  
Improves SEO, accessibility, and resilience. The legacy client-side-only app had poor SEO.

---

## Quality Standards

### Code Quality

- **ESLint:** Airbnb config + React hooks + TypeScript rules (no disabled rules without justification)
- **Prettier:** Enforced formatting (semi: false, singleQuote: true, tailwindcss plugin)
- **File Naming:** kebab-case for files, PascalCase for components
- **Max File Size:** 300 lines (split if exceeded)
- **Comments:** Required for complex logic, prohibited for obvious code

### Git Workflow

- **Branching:** `main` (production), `develop` (staging), `feature/*`, `bugfix/*`, `hotfix/*`
- **Commits:** Conventional Commits format (`feat:`, `fix:`, `docs:`, `test:`, etc.)
- **PR Requirements:** 1+ approvals, CI passing, no merge conflicts
- **Protected Branches:** `main` and `develop` require PR (no direct commits)

### Security

- **Dependencies:** Monthly security audits (`npm audit`)
- **Secrets:** NEVER commit secrets (use environment variables)
- **XSS Prevention:** Sanitize all user-generated content
- **CSRF:** Next.js CSRF tokens on all mutations
- **Rate Limiting:** Implement on API routes (prevent abuse)

---

## Success Metrics

### Technical Metrics (Monitored Continuously)

- TypeScript strict mode errors: **0**
- Test coverage: **>80% unit, >70% integration, 100% E2E critical paths**
- Lighthouse score: **>90 on all pages**
- Bundle size (First Load JS): **<200KB gzip**
- Average API response time: **<500ms**
- Error rate (Sentry): **<0.1% of requests**

### Business Metrics (Tracked Post-Launch)

- User-reported bugs: **<5 per month**
- Page load time (p95): **<3s**
- Mobile usage: **Expected to increase by 20%** (better mobile UX)
- Developer velocity: **Feature delivery 30% faster** (better tooling)

---

## Appendices

### A. Glossary

- **PHR:** Prompt History Record (tracks decisions and context)
- **ADR:** Architectural Decision Record (documents significant architectural choices)
- **SSR:** Server-Side Rendering
- **SSG:** Static Site Generation
- **FCP/LCP/TTI/CLS:** Web Vitals performance metrics
- **Zod:** TypeScript-first schema validation library
- **shadcn/ui:** Accessible component library built on Radix UI + Tailwind

### B. Related Documents

- `MIGRATION_PLAN.md` - Complete technical migration guide
- `MIGRATION_CHECKLIST.md` - Week-by-week task tracker
- `QUICK_START.md` - 30-minute setup guide
- `COMPLETE_ROUTES_API_ENDPOINTS_MAPPING.md` - Legacy system analysis

### C. References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/best-practices)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

---

**Document Status:** Active  
**Next Review Date:** 2026-03-17 (30 days)  
**Constitutional Authority:** Karsaaz QR Development Team

---

*This constitution is a living document. All team members are expected to understand and uphold these principles. Violations should be addressed promptly and respectfully.*
