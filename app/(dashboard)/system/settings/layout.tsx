'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const SETTINGS_TABS = [
  { label: 'General', href: '/system/settings' },
  { label: 'SMTP', href: '/system/settings/smtp' },
  { label: 'Storage', href: '/system/settings/storage' },
  { label: 'Authentication', href: '/system/settings/authentication' },
  { label: 'QR Code Types', href: '/system/settings/qrcode-types' },
  { label: 'Dashboard', href: '/system/settings/dashboard-area' },
  { label: 'Menus', href: '/system/settings/menus' },
  { label: 'Appearance', href: '/system/settings/appearance' },
  { label: 'Advanced', href: '/system/settings/advanced' },
  { label: 'Banner', href: '/system/settings/banner' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">System Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Configure your application settings</p>
      </div>

      <nav className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700 pb-px">
        {SETTINGS_TABS.map((tab) => {
          const isActive = pathname === tab.href || 
            (tab.href !== '/system/settings' && pathname?.startsWith(tab.href));
          const isGeneral = tab.href === '/system/settings' && pathname === '/system/settings';
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-t-lg transition-colors -mb-px',
                (isActive || isGeneral)
                  ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div>{children}</div>
    </div>
  );
}
