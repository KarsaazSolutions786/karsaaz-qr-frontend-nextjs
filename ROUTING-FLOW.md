# Routing Flow - Karsaaz QR (Next.js)

## Route Mapping: Old (Vue.js) → New (Next.js)

### Public Routes
| Old Route | New Route | Description |
|-----------|-----------|-------------|
| `/` | `/` | Landing page (redirects based on auth) |
| `/login` | `/login` | Login page |
| `/register` | `/register` | Registration |
| `/pricing` | `/pricing` | Pricing page |

### Authentication Flow
**Old Behavior:**
- `/` → If logged in, redirect to `userHomePage()` (role-based)
- `/dashboard` → Redirect to `userHomePage()` (role-based)
- `userHomePage()` → Returns `/dashboard/qrcodes` for regular users

**New Behavior:**
- `/` → If logged in, redirect to `/qrcodes`
- `/` → If not logged in, redirect to `/login`
- All routes under `/` are now direct (no `/dashboard` prefix needed)

### Main Application Routes

#### QR Codes Module
| Old Route | New Route | Component |
|-----------|-----------|-----------|
| `/dashboard/qrcodes` | `/qrcodes` | QR Codes List |
| `/dashboard/qrcodes/new` | `/qrcodes/new` | Create QR Code |
| `/dashboard/qrcodes/edit/:id` | `/qrcodes/[id]/edit` | Edit QR Code |
| `/dashboard/qrcodes/stats/:id` | `/qrcodes/[id]/analytics` | QR Analytics |
| `/dashboard/qrcodes/bulk-create` | `/qrcodes/bulk-create` | Bulk Create |
| N/A | `/qrcodes/[id]` | QR Detail (NEW) |

#### Analytics
| Old Route | New Route | Component |
|-----------|-----------|-----------|
| N/A (embedded) | `/analytics` | Global Analytics |

#### Biolinks
| Old Route | New Route | Component |
|-----------|-----------|-----------|
| `/dashboard/biolinks` | `/biolinks` | Biolinks List |
| `/dashboard/biolinks/new` | `/biolinks/new` | Create Biolink |
| `/dashboard/biolinks/edit/:id` | `/biolinks/[id]` | Edit Biolink |

#### Blog Posts
| Old Route | New Route | Component |
|-----------|-----------|-----------|
| `/dashboard/blog-posts` | `/blog-posts` | Blog Posts List |
| `/dashboard/blog-posts/new` | `/blog-posts/new` | Create Post |
| `/dashboard/blog-posts/edit/:id` | `/blog-posts/[id]` | Edit Post |

#### Content Blocks
| Old Route | New Route | Component |
|-----------|-----------|-----------|
| `/dashboard/content-blocks` | `/content-blocks` | Content Blocks List |
| `/dashboard/content-blocks/new` | `/content-blocks/new` | Create Block |
| `/dashboard/content-blocks/edit/:id` | `/content-blocks/[id]` | Edit Block |

#### Lead Forms
| Old Route | New Route | Component |
|-----------|-----------|-----------|
| `/dashboard/lead-forms` | `/lead-forms` | Lead Forms List |
| `/dashboard/lead-forms/new` | `/lead-forms/new` | Create Form |
| `/dashboard/lead-forms/edit/:id` | `/lead-forms/[id]` | Edit Form |

#### Account & Settings
| Old Route | New Route | Component |
|-----------|-----------|-----------|
| `/account/account-details` | `/account` | Account Settings |
| `/account/billing` | `/billing` | Billing & Invoices |
| `/account/subscriptions` | `/subscriptions` | Subscriptions |
| `/account/payment-methods` | `/account/payment-methods` | Payment Methods |
| `/account/promo-codes` | `/account/promo-codes` | Promo Codes |
| `/dashboard/referrals` | `/account/referrals` | Referrals |

## Key Differences

### 1. URL Structure
**Old (Vue.js):**
```
/dashboard/qrcodes
/dashboard/biolinks
/account/billing
```

**New (Next.js):**
```
/qrcodes
/biolinks
/billing
```

**Reason:** Simplified URL structure. The `/dashboard` prefix is removed as all authenticated routes are inherently part of the dashboard.

### 2. Route Protection
**Old:** Custom `<qrcg-protected-route>` component with permission checks

**New:** Middleware + layout-level auth check in `app/(dashboard)/layout.tsx`

### 3. Dynamic Routes
**Old:** Regex-based routing with named groups
```javascript
route="/dashboard/qrcodes/edit/(?<id>\\d+)"
```

**New:** Next.js file-based routing with `[id]` folder
```
app/(dashboard)/qrcodes/[id]/edit/page.tsx
```

### 4. Home Page Redirect
**Old:**
- `/` and `/dashboard` redirect to role-based home page
- Most users land on `/dashboard/qrcodes`

**New:**
- `/` redirects authenticated users to `/qrcodes`
- `/` redirects unauthenticated users to `/login`

## Navigation Structure

### Sidebar Menu (Main)
1. **QR Codes** → `/qrcodes`
2. **Analytics** → `/analytics`
3. **Folders** → `/folders`
4. **Biolinks** → `/biolinks`
5. **Blog Posts** → `/blog-posts`
6. **Content Blocks** → `/content-blocks`
7. **Lead Forms** → `/lead-forms`

### Sidebar Menu (Settings)
8. **Account** → `/account`
9. **Billing** → `/billing`

### Logo Click
Logo in sidebar → `/qrcodes` (default home)

## Migration Notes

### What Changed
✅ Removed `/dashboard` prefix from all routes
✅ Simplified authentication flow
✅ Unified account/billing routes under single structure
✅ Added new `/qrcodes/[id]` detail view

### What Stayed the Same
✅ Route permissions (to be implemented)
✅ Protected route behavior
✅ Redirect after login
✅ Overall navigation structure

### Breaking Changes for Users
⚠️ Bookmarks will break (old `/dashboard/qrcodes` → new `/qrcodes`)
⚠️ Deep links from emails will need updating
⚠️ Browser history won't work across migration

### Mitigation Strategy
- Add redirect rules from old routes to new routes
- Update all email templates with new URLs
- Add meta redirects for old bookmark URLs

## Implementation Checklist

- [X] Root route (`/`) auto-redirect based on auth
- [X] Dashboard layout with sidebar navigation
- [X] QR Codes list page (`/qrcodes`)
- [X] QR Code detail page (`/qrcodes/[id]`)
- [X] Analytics page (`/analytics`)
- [ ] Create QR wizard (`/qrcodes/new`)
- [ ] Edit QR page (`/qrcodes/[id]/edit`)
- [ ] QR Analytics page (`/qrcodes/[id]/analytics`)
- [ ] Bulk create page (`/qrcodes/bulk-create`)
- [ ] Folders page (`/folders`)
- [ ] All other module pages

## SEO & Metadata

Each route should have proper metadata:

```typescript
export const metadata = {
  title: 'QR Codes | Karsaaz QR',
  description: 'Manage your QR codes',
  openGraph: {
    title: 'QR Codes | Karsaaz QR',
    description: 'Manage your QR codes',
  },
}
```

## Performance Targets

| Route | Target Load Time | Notes |
|-------|-----------------|-------|
| `/qrcodes` | <2s | With 100 QR codes |
| `/analytics` | <3s | With charts |
| `/qrcodes/[id]` | <1s | Single QR detail |
| `/qrcodes/new` | <2s | Wizard load |

---

**Status:** Core routing structure implemented ✅  
**Next:** Complete remaining page implementations
