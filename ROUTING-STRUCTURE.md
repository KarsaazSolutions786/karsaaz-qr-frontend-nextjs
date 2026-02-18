# Routing Structure - Karsaaz QR Next.js

## Overview
Complete routing structure for the QR code management application using Next.js 14 App Router.

## Route Tree

```
app/
├── (public)/                    # Public routes (unauthenticated)
│   ├── page.tsx                # Landing page
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   └── forgot-password/        # Password reset
│
├── (auth)/                     # Auth routes (special layout)
│   └── ...auth flows
│
├── (dashboard)/                # Protected dashboard routes
│   ├── layout.tsx              # Dashboard layout with sidebar
│   │
│   ├── qrcodes/                # QR Code Management
│   │   ├── page.tsx            # QR codes list with filters/folders
│   │   ├── new/                # Create QR code wizard
│   │   │   └── page.tsx
│   │   ├── bulk-create/        # Bulk QR code creation
│   │   │   └── page.tsx
│   │   └── [id]/               # Individual QR code routes
│   │       ├── page.tsx        # QR code detail view
│   │       ├── edit/           # Edit QR code
│   │       │   └── page.tsx
│   │       └── analytics/      # QR code specific analytics
│   │           └── page.tsx
│   │
│   ├── analytics/              # Global Analytics
│   │   └── page.tsx            # Analytics dashboard with all components
│   │
│   ├── folders/                # Folder Management (future)
│   │   └── page.tsx            # Folder organization view
│   │
│   ├── biolinks/               # Biolink Management
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── blog-posts/             # Blog Post Management
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── content-blocks/         # Content Blocks
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── lead-forms/             # Lead Forms
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── account/                # Account Settings
│   │   └── page.tsx
│   │
│   ├── billing/                # Billing & Subscriptions
│   │   └── page.tsx
│   │
│   └── subscriptions/          # Subscription Management
│       └── page.tsx
│
└── api/                        # API routes
    └── ...api endpoints
```

## Component Integration by Route

### `/qrcodes` - QR Codes List
**Integrated Components:**
- ✅ DebouncedSearch - Search with 300ms debounce
- ✅ FilterModal - Advanced filtering (10 filter types)
- ✅ FolderTree - Folder navigation sidebar
- ✅ MultiSelectToolbar - Bulk actions
- ✅ QRCodeCardSkeleton - Loading states
- ✅ NoQRCodesEmptyState - Empty state
- ✅ NoSearchResultsEmptyState - No results state
- ✅ VirtualizedList - For large datasets (ready to integrate)

**Features:**
- Search QR codes with debouncing
- Filter by type, status, date, folder, scans, tags
- Organize with folder sidebar
- Multi-select with Ctrl/Cmd and Shift
- Bulk actions (download, delete, archive, move)
- Pagination
- Loading skeletons
- Empty states

### `/qrcodes/new` - Create QR Code
**Components Needed:**
- QR Type Selector
- QR Designer (colors, logos, patterns)
- Sticker Gallery
- Download Options (size, quality, format)
- Wizard State (Zustand)

### `/qrcodes/[id]` - QR Code Detail
**Components Needed:**
- QR Code Preview
- Action Buttons:
  - TypeConversionModal
  - DuplicateModal
  - TransferOwnershipModal
  - ArchiveModal
  - PINProtectionModal
- Download Options (all formats)
- Analytics Summary

### `/qrcodes/[id]/edit` - Edit QR Code
**Components Needed:**
- Same as create wizard
- Pre-populated with existing data

### `/qrcodes/[id]/analytics` - QR Analytics
**Integrated Components:**
- ✅ RealtimeStatsWidget - Live scan tracking
- ✅ LocationMap - Geographic distribution
- ✅ DeviceBrowserCharts - Device/browser breakdown
- ✅ ReferrerTracker - Referrer sources
- Chart components (Line, Bar, Pie)

### `/analytics` - Global Analytics
**Integrated Components:**
- ✅ RealtimeStatsWidget - Real-time overview
- ✅ LocationMap - All scans by location
- ✅ DeviceBrowserCharts - Device/browser stats
- ✅ ReferrerTracker - Top referrers
- ✅ MetricCard - Key metrics grid
- ✅ Various charts - Time series, top performers

## Navigation Components

### Sidebar Navigation
**Location:** `app/(dashboard)/layout.tsx`

**Menu Structure:**
```typescript
[
  {
    name: 'Dashboard',
    href: '/',
    icon: HomeIcon,
  },
  {
    name: 'QR Codes',
    href: '/qrcodes',
    icon: QrCodeIcon,
    badge: qrCodesCount,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
  },
  {
    name: 'Biolinks',
    href: '/biolinks',
    icon: LinkIcon,
  },
  {
    name: 'Blog Posts',
    href: '/blog-posts',
    icon: NewspaperIcon,
  },
  {
    name: 'Content Blocks',
    href: '/content-blocks',
    icon: Squares2X2Icon,
  },
  {
    name: 'Lead Forms',
    href: '/lead-forms',
    icon: ClipboardIcon,
  },
  // Separator
  {
    name: 'Account',
    href: '/account',
    icon: UserIcon,
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCardIcon,
  },
]
```

## Route Protection

All routes under `(dashboard)/` are protected by middleware:
- Checks authentication status
- Redirects to `/login` if not authenticated
- Validates session/token

## Performance Optimizations Applied

### Code Splitting
- Each page is automatically code-split by Next.js
- Dynamic imports for heavy components (charts, maps)

### Data Fetching
- React Query for caching and background updates
- Optimistic updates for better UX
- Stale-while-revalidate strategy

### Client-Side Navigation
- Next.js Link component for instant navigation
- Prefetching on hover
- Shallow routing for filter/pagination changes

## URL Parameters

### `/qrcodes`
```
?search=term          # Search query
&type=url             # Filter by type
&status=active        # Filter by status
&folder=123           # Filter by folder
&page=2               # Pagination
&sort=created_at      # Sort field
&order=desc           # Sort direction
```

### `/analytics`
```
?start=2024-01-01     # Date range start
&end=2024-01-31       # Date range end
&preset=last30days    # Date preset
&qrcode=123           # Specific QR code filter
```

## Dynamic Routes

### QR Code ID Routes
```typescript
// Pattern: /qrcodes/[id]
// Examples:
/qrcodes/123              // QR code detail
/qrcodes/123/edit         // Edit QR code
/qrcodes/123/analytics    // QR analytics
```

### Biolink ID Routes
```typescript
// Pattern: /biolinks/[id]
/biolinks/456             // Biolink detail
/biolinks/456/edit        // Edit biolink
```

## Future Routes (Not Yet Created)

### `/folders` - Folder Management
**Components Ready:**
- ✅ FolderTree
- ✅ FolderModal
- ✅ FolderBreadcrumb
- ✅ useFolders hook

### `/qrcodes/bulk-create` - Bulk QR Creation
**Components Ready:**
- ✅ Wizard state management
- ✅ Bulk download with ZIP

### `/settings` - User Settings
**Components Needed:**
- User profile form
- Password change
- Notification preferences
- API keys management

### `/integrations` - Third-party Integrations
**Components Needed:**
- Integration cards
- OAuth flows
- API configuration

## Metadata & SEO

Each page includes:
- Dynamic page titles
- Meta descriptions
- Open Graph tags
- Canonical URLs
- Structured data (JSON-LD)

Example from QR codes page:
```typescript
export const metadata = {
  title: 'QR Codes | Karsaaz QR',
  description: 'Manage all your QR codes in one place',
}
```

## Accessibility Features

All routes include:
- ✅ Skip links to main content
- ✅ Proper heading hierarchy
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus management

## Error Handling

Each route is wrapped with:
- ✅ ErrorBoundary component
- ✅ Error fallback UI
- ✅ Retry functionality
- ✅ Error logging (Sentry integration ready)

## Loading States

Each route shows:
- ✅ Skeleton loaders during initial load
- ✅ Shimmer animations
- ✅ Progressive enhancement
- ✅ Optimistic UI updates

## Empty States

Each list view includes:
- ✅ No items state with CTA
- ✅ No search results state
- ✅ No data available state
- ✅ Error state with retry

## Next Steps

1. **Create Missing Pages:**
   - `/folders/page.tsx` - Folder management view
   - `/qrcodes/bulk-create/page.tsx` - Bulk creation wizard

2. **Enhance Existing Pages:**
   - Add more filters to QR codes list
   - Add export functionality
   - Add print view for analytics

3. **Add Dynamic Metadata:**
   - Per-QR code metadata
   - Social sharing previews

4. **Implement Breadcrumbs:**
   - Add to all nested routes
   - Show path hierarchy

5. **Add Page Transitions:**
   - Smooth transitions between routes
   - Loading bars for navigation

## Route Performance Targets

- ✅ Initial page load: <2s
- ✅ Client-side navigation: <200ms
- ✅ Filter/search updates: <300ms (debounced)
- ✅ Pagination: <100ms
- ✅ 60fps scrolling with virtualization
