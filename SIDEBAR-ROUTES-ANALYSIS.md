# Complete Sidebar & Routes Analysis - Old vs New

## Old App Sidebar Structure (Vue.js/Lit)

### For Regular Users (Client Role)

#### 1. QR Management (Locked Group)
- **Home** → `/dashboard/qrcodes/new` (Create QR)
- **Existing QRs** → `/dashboard/qrcodes` (List QR)
- **Archived** → `/dashboard/qrcodes?archived=true` (Archived QR)

#### 2. Folders (Dynamic - Locked Group)
- **Folder 1** → `/dashboard/qrcodes?folder_id=1`
- **Folder 2** → `/dashboard/qrcodes?folder_id=2`
- etc... (loaded from API)

#### 3. Categories (Dynamic - Locked Group)
- **Category 1** → `/dashboard/qrcodes/new?template-category-id=1`
- **Category 2** → `/dashboard/qrcodes/new?template-category-id=2`
- etc... (loaded from API)

#### 4. Referrals (Collapsible Group)
- **Commission Summary** → `/dashboard/referrals`
- **Withdrawal History** → `/dashboard/referrals?tab=history`
- **Request Withdrawal** → `/dashboard/referrals?tab=withdraw`

#### 5. Storage Connections (Locked Group)
- **Connections** → `/dashboard/cloud-storage`

---

### For Admin Users (Super Admin Role)

#### 1. QR Management (Same as above)

#### 2. Folders (Same as above)

#### 3. Categories (Same as above)

#### 4. Storage Connections (Same as above)

#### 5. Users (Collapsible Group)
- **All Users** → `/dashboard/users`
- **Paying Users** → `/dashboard/users?paying=true`
- **Non Paying Users** → `/dashboard/users?paying=false`
- **Roles** → `/dashboard/roles`

#### 6. Finance (Collapsible Group)
- **Plans/Products** → `/dashboard/subscription-plans` or `/dashboard/products`
- **Subscriptions** → `/dashboard/subscriptions`
- **Billing** → `/dashboard/billing`
- **Transactions** → `/dashboard/transactions`
- **Payment Processors** → `/dashboard/payment-processors`
- **Currencies** → `/dashboard/currencies`

#### 7. Content (Collapsible Group)
- **Blog Posts** → `/dashboard/blog-posts`
- **Content Blocks** → `/dashboard/content-blocks`
- **Translations** → `/dashboard/translations`
- **Custom Code** → `/dashboard/custom-codes`
- **Pages** → `/dashboard/pages`
- **Dynamic BioLinks** → `/dashboard/dynamic-biolink-blocks` (Large droplet only)

#### 8. Contacts (Collapsible Group)
- **Contact Form** → `/dashboard/contacts`
- **Lead Form** → `/dashboard/lead-forms`

#### 9. Plugins (Collapsible Group)
- **Available Plugins** → `/dashboard/plugins/available`
- **Installed Plugins** → `/dashboard/plugins/installed`

#### 10. System (Collapsible Group)
- **Status** → `/dashboard/system/status`
- **Settings** → `/dashboard/system/settings`
- **Logs** → `/dashboard/system/logs`
- **Cache** → `/dashboard/system/cache`
- **Notifications** → `/dashboard/system/notifications`
- **SMS Portals** → `/dashboard/system/sms`
- **Auth Workflow** → `/dashboard/system/auth-workflow`
- **Abuse Reports** → `/dashboard/admin/abuse-reports`
- **Domains** → `/dashboard/domains`
- **Template Categories** → `/dashboard/template-categories` (Large droplet only)

---

## Sidebar Footer
- **Upgrade to PRO Banner** (if not premium)
- **Logout Button**

---

## Current Next.js Implementation Status

### ✅ Implemented Routes
1. `/qrcodes` - QR Codes List
2. `/qrcodes/[id]` - QR Detail (NEW)
3. `/qrcodes/[id]/edit` - Edit QR
4. `/qrcodes/[id]/analytics` - QR Analytics
5. `/qrcodes/new` - Create QR
6. `/qrcodes/bulk-create` - Bulk Create
7. `/analytics` - Global Analytics (NEW)
8. `/biolinks` - Biolinks List
9. `/biolinks/[id]` - Biolink Detail
10. `/biolinks/new` - Create Biolink
11. `/blog-posts` - Blog Posts List
12. `/content-blocks` - Content Blocks List
13. `/lead-forms` - Lead Forms List
14. `/account` - Account Settings
15. `/billing` - Billing
16. `/subscriptions` - Subscriptions

### ❌ Missing Routes (Need to Create)

#### QR Management
- `/qrcodes?archived=true` - Archived QRs (filter on existing page)
- `/qrcodes?folder_id=X` - Folder filter (filter on existing page)

#### Folders (NEW MODULE)
- `/folders` - Manage folders (CRUD)

#### Referrals (NEW MODULE)
- `/referrals` - Commission summary
- `/referrals?tab=history` - Withdrawal history
- `/referrals?tab=withdraw` - Request withdrawal

#### Cloud Storage (NEW MODULE)
- `/cloud-storage` - Storage connections

#### Users (ADMIN - NEW MODULE)
- `/users` - All users
- `/users?paying=true` - Paying users
- `/users?paying=false` - Non-paying users
- `/roles` - Roles management

#### Finance (ADMIN - NEW MODULE)
- `/subscription-plans` or `/products` - Plans/Products
- `/subscriptions` (exists but may need admin view)
- `/billing` (exists but may need admin view)
- `/transactions` - All transactions
- `/payment-processors` - Payment processors config
- `/currencies` - Currency management

#### Content (ADMIN - NEW MODULE)
- `/blog-posts` (exists - needs admin features)
- `/content-blocks` (exists - needs admin features)
- `/translations` - Translation management
- `/custom-codes` - Custom code injection
- `/pages` - Static pages management
- `/dynamic-biolink-blocks` - Dynamic biolink blocks

#### Contacts (ADMIN - NEW MODULE)
- `/contacts` - Contact form submissions
- `/lead-forms` (exists - needs admin view)

#### Plugins (ADMIN - NEW MODULE)
- `/plugins/available` - Available plugins
- `/plugins/installed` - Installed plugins

#### System (ADMIN - NEW MODULE)
- `/system/status` - System status
- `/system/settings` - System settings
- `/system/logs` - System logs
- `/system/cache` - Cache management
- `/system/notifications` - Notification settings
- `/system/sms` - SMS portals
- `/system/auth-workflow` - Auth workflow config
- `/admin/abuse-reports` - Abuse reports
- `/domains` - Domain management
- `/template-categories` - Template categories

---

## Sidebar Navigation - New Structure

### For Regular Users (Next.js)

```typescript
const clientNavigation = [
  {
    name: 'QR Management',
    items: [
      { name: 'Create QR', href: '/qrcodes/new', icon: PlusIcon },
      { name: 'My QR Codes', href: '/qrcodes', icon: QrCodeIcon },
      { name: 'Archived', href: '/qrcodes?archived=true', icon: ArchiveBoxIcon },
    ],
  },
  {
    name: 'Folders',
    items: [
      // Dynamic - loaded from API
      { name: 'Work', href: '/qrcodes?folder_id=1', icon: FolderIcon },
      { name: 'Personal', href: '/qrcodes?folder_id=2', icon: FolderIcon },
    ],
    footer: { name: 'Manage Folders', href: '/folders' },
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
  },
  {
    name: 'Referrals',
    items: [
      { name: 'Commission', href: '/referrals', icon: CurrencyDollarIcon },
      { name: 'History', href: '/referrals?tab=history', icon: ClockIcon },
      { name: 'Withdraw', href: '/referrals?tab=withdraw', icon: BanknotesIcon },
    ],
  },
  {
    name: 'Storage',
    href: '/cloud-storage',
    icon: CloudIcon,
  },
]

const settingsNavigation = [
  { name: 'Account', href: '/account', icon: UserIcon },
  { name: 'Billing', href: '/billing', icon: CreditCardIcon },
  { name: 'Subscription', href: '/subscriptions', icon: SparklesIcon },
]
```

### For Admin Users (Next.js)

```typescript
const adminNavigation = [
  ...clientNavigation, // Include all client features
  {
    name: 'Users',
    items: [
      { name: 'All Users', href: '/users' },
      { name: 'Paying', href: '/users?paying=true' },
      { name: 'Non-Paying', href: '/users?paying=false' },
      { name: 'Roles', href: '/roles' },
    ],
  },
  {
    name: 'Finance',
    items: [
      { name: 'Plans', href: '/subscription-plans' },
      { name: 'Subscriptions', href: '/subscriptions' },
      { name: 'Transactions', href: '/transactions' },
      { name: 'Payment Processors', href: '/payment-processors' },
      { name: 'Currencies', href: '/currencies' },
    ],
  },
  {
    name: 'Content',
    items: [
      { name: 'Blog Posts', href: '/blog-posts' },
      { name: 'Content Blocks', href: '/content-blocks' },
      { name: 'Translations', href: '/translations' },
      { name: 'Custom Code', href: '/custom-codes' },
      { name: 'Pages', href: '/pages' },
      { name: 'Dynamic BioLinks', href: '/dynamic-biolink-blocks' },
    ],
  },
  {
    name: 'Contacts',
    items: [
      { name: 'Contact Forms', href: '/contacts' },
      { name: 'Lead Forms', href: '/lead-forms' },
    ],
  },
  {
    name: 'Plugins',
    items: [
      { name: 'Available', href: '/plugins/available' },
      { name: 'Installed', href: '/plugins/installed' },
    ],
  },
  {
    name: 'System',
    items: [
      { name: 'Status', href: '/system/status' },
      { name: 'Settings', href: '/system/settings' },
      { name: 'Logs', href: '/system/logs' },
      { name: 'Cache', href: '/system/cache' },
      { name: 'Notifications', href: '/system/notifications' },
      { name: 'SMS', href: '/system/sms' },
      { name: 'Auth', href: '/system/auth-workflow' },
      { name: 'Abuse', href: '/admin/abuse-reports' },
      { name: 'Domains', href: '/domains' },
      { name: 'Categories', href: '/template-categories' },
    ],
  },
]
```

---

## Implementation Priority

### Phase 1: Core Features (User-Facing)
1. ✅ QR Codes List & Detail
2. ✅ Analytics Dashboard
3. ⏳ Folders Management
4. ⏳ Referral System
5. ⏳ Cloud Storage Connections

### Phase 2: Admin - Users & Finance
6. ⏳ Users Management
7. ⏳ Roles Management
8. ⏳ Subscription Plans
9. ⏳ Transactions
10. ⏳ Payment Processors
11. ⏳ Currencies

### Phase 3: Admin - Content & Communication
12. ⏳ Translations
13. ⏳ Custom Code
14. ⏳ Pages
15. ⏳ Dynamic BioLinks
16. ⏳ Contact Form Submissions

### Phase 4: Admin - System & Plugins
17. ⏳ Plugins Management
18. ⏳ System Status
19. ⏳ System Settings
20. ⏳ Logs
21. ⏳ Cache
22. ⏳ Notifications
23. ⏳ SMS Portals
24. ⏳ Auth Workflow
25. ⏳ Abuse Reports
26. ⏳ Domains
27. ⏳ Template Categories

---

## Differences from Old App

### Simplified Structure
- Removed `/dashboard` prefix from all routes
- Made "Analytics" a top-level feature (was embedded)
- Added QR detail page (`/qrcodes/[id]`)

### New Features
- Global analytics dashboard
- Enhanced QR detail view with all actions
- Better folder management (dedicated page)

### Missing Features (Intentional)
- Template categories (can be folder-based)
- QR templates page (integrated into wizard)

---

## Next Steps

1. **Update Sidebar Component**
   - Add collapsible groups
   - Add dynamic folder loading
   - Add role-based menu rendering
   - Add "Upgrade to PRO" banner

2. **Create Missing Pages (Priority Order)**
   - `/folders` - Folder CRUD
   - `/referrals` - Referral system
   - `/cloud-storage` - Storage connections
   - Admin modules (Users, Finance, Content, System)

3. **Update Existing Pages**
   - Add archived filter to `/qrcodes`
   - Add folder filter to `/qrcodes`
   - Admin views for existing pages

