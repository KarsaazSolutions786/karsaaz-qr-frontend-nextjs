"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  LayoutDashboard,
  LifeBuoy,
  Palette,
  QrCode,
  Server,
  Settings,
  Share2,
  Shield
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface MenuItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: { title: string; href: string }[];
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    title: "QR Codes",
    icon: QrCode,
    children: [
      { title: "All QR Codes", href: "/dashboard/qrcodes" },
      { title: "Create QR", href: "/dashboard/qrcodes/new" },
      { title: "Bulk Create", href: "/dashboard/qrcodes/bulk-create" },
      { title: "Archived", href: "/dashboard/qrcodes/archived" },
    ],
  },
  { title: "Folders", href: "/dashboard/folders", icon: Folder },
  { title: "Referrals", href: "/dashboard/referrals", icon: Share2 },
  { title: "Support", href: "/dashboard/support", icon: LifeBuoy },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "Account", href: "/account/my-account" },
      { title: "Account Details", href: "/account/account-details" },
      { title: "Billing", href: "/account/billing" },
      { title: "Subscriptions", href: "/account/subscriptions" },
      { title: "Team", href: "/account/team" },
      { title: "Credits", href: "/account/credits" },
      { title: "Payment Methods", href: "/account/payment-methods" },
      { title: "Promo Codes", href: "/account/promo-codes" },
    ],
  },
  {
    title: "Admin",
    icon: Shield,
    adminOnly: true,
    children: [
      { title: "Users", href: "/dashboard/users" },
      { title: "Roles", href: "/dashboard/roles" },
      { title: "Plans", href: "/dashboard/subscription-plans" },
      { title: "Subscriptions", href: "/dashboard/subscriptions" },
      { title: "Billing", href: "/dashboard/billing" },
      { title: "Domains", href: "/dashboard/domains" },
      { title: "Currencies", href: "/dashboard/currencies" },
      { title: "Payment Processors", href: "/dashboard/payment-processors" },
      { title: "Transactions", href: "/dashboard/transactions" },
    ],
  },
  {
    title: "Content",
    icon: FileText,
    adminOnly: true,
    children: [
      { title: "Blog Posts", href: "/dashboard/blog-posts" },
      { title: "Pages", href: "/dashboard/pages" },
      { title: "Content Blocks", href: "/dashboard/content-blocks" },
      { title: "Translations", href: "/dashboard/translations" },
      { title: "Custom Codes", href: "/dashboard/custom-codes" },
    ],
  },
  {
    title: "Tools",
    icon: Palette,
    adminOnly: true,
    children: [
      { title: "Templates", href: "/dashboard/templates" },
      { title: "Cloud Storage", href: "/dashboard/cloud-storage" },
      { title: "Lead Forms", href: "/dashboard/lead-forms" },
      { title: "Plugins", href: "/dashboard/plugins" },
      { title: "Abuse Reports", href: "/dashboard/abuse-reports" },
    ],
  },
  {
    title: "System",
    icon: Server,
    adminOnly: true,
    children: [
      { title: "Status", href: "/dashboard/system/status" },
      { title: "Settings", href: "/dashboard/system/settings" },
      { title: "Logs", href: "/dashboard/system/logs" },
      { title: "Cache", href: "/dashboard/system/cache" },
      { title: "Notifications", href: "/dashboard/system/notifications" },
      { title: "SMS Portals", href: "/dashboard/system/sms" },
      { title: "Auth Workflow", href: "/dashboard/system/auth-workflow" },
    ],
  },
];

import { useAuthStore } from "@/store/useAuthStore";

export default function Sidebar() {
  const { isSidebarOpen } = useStore();
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  // Admin check based on roles array
  const isAdmin = user?.roles?.some(r => r.name === "Super Admin" || r.name === "Admin" || r.super_admin) || false;

  if (!isSidebarOpen) return null;

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-700",
        isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b px-6 dark:border-gray-700">
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Karsaaz QR
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;

          return (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleGroup(item.title)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                      pathname.startsWith(item.href || "") && "bg-gray-100 dark:bg-gray-700"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                      {item.title}
                    </div>
                    {openGroups.includes(item.title) ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  {openGroups.includes(item.title) && (
                    <div className="mt-1 space-y-1 pl-11">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
                            pathname === child.href && "bg-gray-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                    pathname === item.href && "bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                  {item.title}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
