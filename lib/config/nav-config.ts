import {
  QrCodeIcon,
  ArchiveBoxIcon,
  CloudIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  BanknotesIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  PuzzlePieceIcon,
  ServerIcon,
  HomeIcon,
  WalletIcon,
  RectangleStackIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'

// Navigation types
export interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export interface FigmaNavItem {
  key: string
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  adminOnly?: boolean
}

export interface FigmaNavSection {
  key: string
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  items: NavItem[]
  adminOnly?: boolean
}

// Admin-only route prefixes -- regular users are redirected away
export const ADMIN_ROUTE_PREFIXES = [
  '/users',
  '/plans',
  '/subscriptions',
  '/billing',
  '/transactions',
  '/payment-processors',
  '/currencies',
  '/plugins',
  '/system',
  '/blog-posts',
  '/content-blocks',
  '/translations',
  '/custom-codes',
  '/pages',
  '/dynamic-biolink-blocks',
  '/contacts',
  '/lead-forms',
  '/support-tickets',
]

export const figmaPrimaryNav: FigmaNavItem[] = [
  { key: 'home', label: 'Home', href: '/qrcodes/new', icon: HomeIcon },
  { key: 'existing-qr', label: 'Existing QR', href: '/qrcodes', icon: QrCodeIcon },
  { key: 'archived', label: 'Archived', href: '/archived', icon: ArchiveBoxIcon },
  { key: 'qr-templates', label: 'Templates', href: '/qrcode-templates', icon: RectangleStackIcon },
  {
    key: 'storage-connections',
    label: 'Storage Connections',
    href: '/cloud-storage',
    icon: CloudIcon,
  },
]

// User-facing sections (visible to all authenticated users)
export const figmaUserSectionNav: FigmaNavSection[] = []

export const figmaSectionNav: FigmaNavSection[] = [
  {
    key: 'users',
    label: 'Users',
    href: '/users',
    icon: UsersIcon,
    adminOnly: true,
    items: [
      { name: 'All Users', href: '/users', icon: UsersIcon },
      { name: 'Paying Users', href: '/users/paying', icon: UsersIcon },
      { name: 'Non Paying Users', href: '/users/non-paying', icon: UsersIcon },
      { name: 'Roles', href: '/users/roles', icon: UsersIcon },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    href: '/plans',
    icon: BanknotesIcon,
    adminOnly: true,
    items: [
      { name: 'Pricing Plans', href: '/plans', icon: BanknotesIcon },
      { name: 'Credit Pricing', href: '/plans/credit-pricing', icon: BanknotesIcon },
      { name: 'Subscriptions', href: '/subscriptions', icon: BanknotesIcon },
      { name: 'Billing', href: '/billing', icon: BanknotesIcon },
      { name: 'Transactions', href: '/transactions', icon: BanknotesIcon },
      { name: 'Payment Processors', href: '/payment-processors', icon: BanknotesIcon },
      { name: 'Currencies', href: '/currencies', icon: BanknotesIcon },
    ],
  },
  {
    key: 'content',
    label: 'Content',
    href: '/blog-posts',
    icon: DocumentTextIcon,
    adminOnly: true,
    items: [
      { name: 'Blog Posts', href: '/blog-posts', icon: DocumentTextIcon },
      { name: 'Content Blocks', href: '/content-blocks', icon: DocumentTextIcon },
      { name: 'Translations', href: '/translations', icon: DocumentTextIcon },
      { name: 'Custom Code', href: '/custom-codes', icon: DocumentTextIcon },
      { name: 'Pages', href: '/pages', icon: DocumentTextIcon },
      { name: 'Dynamic BioLinks', href: '/dynamic-biolink-blocks', icon: DocumentTextIcon },
    ],
  },
  {
    key: 'contacts',
    label: 'Contacts',
    href: '/contacts',
    icon: EnvelopeIcon,
    adminOnly: true,
    items: [
      { name: 'Contact Form', href: '/contacts', icon: EnvelopeIcon },
      { name: 'Lead Forms', href: '/lead-forms', icon: EnvelopeIcon },
      { name: 'Support Tickets', href: '/support-tickets', icon: EnvelopeIcon },
    ],
  },
  {
    key: 'plugins',
    label: 'Plugins',
    href: '/plugins/available',
    icon: PuzzlePieceIcon,
    adminOnly: true,
    items: [
      { name: 'Available Plugins', href: '/plugins/available', icon: PuzzlePieceIcon },
      { name: 'Installed Plugins', href: '/plugins/installed', icon: PuzzlePieceIcon },
    ],
  },
  {
    key: 'system',
    label: 'System',
    href: '/system/status',
    icon: ServerIcon,
    adminOnly: true,
    items: [
      { name: 'Status', href: '/system/status', icon: ServerIcon },
      { name: 'Settings', href: '/system/settings', icon: ServerIcon },
      { name: 'Logs', href: '/system/logs', icon: ServerIcon },
      { name: 'Cache', href: '/system/cache', icon: ServerIcon },
      { name: 'Notifications', href: '/system/notifications', icon: ServerIcon },
      { name: 'Sms Portals', href: '/system/sms-portals', icon: ServerIcon },
      { name: 'Auth Workflow', href: '/system/auth-workflow', icon: ServerIcon },
      { name: 'Guest Settings', href: '/admin/guest-settings', icon: ServerIcon },
      { name: 'Abuse Reports', href: '/system/abuse-reports', icon: ServerIcon },
      { name: 'Domains', href: '/system/domains', icon: ServerIcon },
      { name: 'Template Categories', href: '/template-categories', icon: ServerIcon },
      { name: 'API Docs', href: '/system/api-docs', icon: ServerIcon },
    ],
  },
]

// Re-export icons used by sub-components
export { ChevronRightIcon, ArrowRightOnRectangleIcon, LinkIcon, WalletIcon }
