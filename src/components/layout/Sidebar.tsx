"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

/* ── Figma sidebar icon map (Pixel-Perfect) ─────────────────────────── */
const ICON = {
  logoText: "/images/sidebar-icons/logo-text.svg",
  logoQR: "/images/sidebar-icons/logo-qr.svg",
  collapseBtn: "/images/sidebar-icons/collapse-btn.svg",
  homeActive: "/images/sidebar-icons/home-white.svg",
  homeInactive: "/images/sidebar-icons/home-line.svg",
  existingQR: "/images/sidebar-icons/existing-qr-line.svg",
  archived: "/images/sidebar-icons/archived-line.svg",
  storage: "/images/sidebar-icons/storage-line.svg",
  users: "/images/sidebar-icons/users-line.svg",
  finance: "/images/sidebar-icons/finance-line.svg",
  content: "/images/sidebar-icons/content-line.svg",
  contacts: "/images/sidebar-icons/contacts-line.svg",
  plugins: "/images/sidebar-icons/plugins-line.svg",
  system: "/images/sidebar-icons/system-line.svg",
  chevron: "/images/sidebar-icons/chevron-line.svg",
  logoutIcon: "/images/sidebar-icons/logout-red-icon.svg",
  logoutArrow: "/images/sidebar-icons/logout-red-arrow.svg",
  apple: "/images/sidebar-icons/apple-store.svg",
  googlePlay: "/images/sidebar-icons/google-play-store.svg",
} as const;

/* ── Menu items matching Figma nav structure ─────────────────── */
interface MenuItem {
  title: string;
  href?: string;
  icon?: string;
  activeIcon?: string;
  children?: { title: string; href: string }[];
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { title: "Home", href: "/dashboard", icon: ICON.homeInactive, activeIcon: ICON.homeActive },
  { title: "Existing QR", href: "/dashboard/qrcodes", icon: ICON.existingQR },
  { title: "Bulk Operations", href: "/dashboard/bulk-operations", icon: ICON.content },
  { title: "Archived", href: "/dashboard/qrcodes/archived", icon: ICON.archived },
  { title: "Storage Connections", href: "/dashboard/cloud-storage", icon: ICON.storage },
  {
    title: "Users",
    icon: ICON.users,
    adminOnly: true,
    children: [
      { title: "All users", href: "/dashboard/users" },
      { title: "Paying users", href: "/dashboard/users?filter=paying" },
      { title: "Non paying users", href: "/dashboard/users?filter=non-paying" },
      { title: "Roles", href: "/dashboard/roles" },
    ],
  },
  {
    title: "Finance",
    icon: ICON.finance,
    adminOnly: true,
    children: [
      { title: "Plans", href: "/dashboard/subscription-plans" },
      { title: "Credit Pricing", href: "/dashboard/subscription-plans/credit-pricing" },
      { title: "Subscriptions", href: "/dashboard/subscriptions" },
      { title: "Billing", href: "/dashboard/billing" },
      { title: "Transactions", href: "/dashboard/transactions" },
      { title: "Currencies", href: "/dashboard/currencies" },
      { title: "Payment Processors", href: "/dashboard/payment-processors" },
    ],
  },
  {
    title: "Content",
    icon: ICON.content,
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
    title: "Contacts",
    icon: ICON.contacts,
    adminOnly: true,
    children: [
      { title: "Lead Forms", href: "/dashboard/lead-forms" },
      { title: "Submissions", href: "/dashboard/lead-submissions" },
    ],
  },
  {
    title: "Plugins",
    icon: ICON.plugins,
    adminOnly: true,
    children: [
      { title: "Templates", href: "/dashboard/qrcode-templates" },
      { title: "Cloud Storage", href: "/dashboard/cloud-storage" },
      { title: "Plugins", href: "/dashboard/plugins" },
      { title: "Domains", href: "/dashboard/domains" },
    ],
  },
  {
    title: "System",
    icon: ICON.system,
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
  {
    title: "Help & Support",
    icon: ICON.system,
    children: [
      { title: "Support Tickets", href: "/account/support-tickets" },
      { title: "Report Abuse", href: "/dashboard/report-abuse" },
    ],
  },
];

/* ── Sidebar component ──────────────────────────────────────── */
export default function Sidebar() {
  const { isSidebarOpen } = useStore();
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isAdmin =
    user?.roles?.some(
      (r) => r.name === "Super Admin" || r.name === "Admin" || r.super_admin
    ) || false;

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (item: MenuItem) =>
    item.children?.some((child) => pathname === child.href) || false;

  if (!isSidebarOpen) return null;

  return (
    <aside className="sidebar-figma">
      {/* ── Logo row (Pixel-Perfect mix) ───────────────────── */}
      <div className="sidebar-logo-row">
        <div className="sidebar-logo-group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ICON.logoText} alt="Karsaaz" className="sidebar-logo-img" />
          <div className="sidebar-qr-badge">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ICON.logoQR} alt="QR" className="sidebar-qr-badge-img" />
          </div>
        </div>
        <button className="sidebar-collapse-btn" aria-label="Collapse sidebar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ICON.collapseBtn} alt="" className="sidebar-collapse-icon" />
        </button>
      </div>

      {/* ── Navigation items ─────────────────────────────── */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;

          const hasChildren = !!item.children;
          const groupOpen = openGroups.includes(item.title);
          const groupIsActive = isGroupActive(item);
          const active = !hasChildren && item.href && isActive(item.href);

          return (
            <div key={item.title}>
              {hasChildren ? (
                /* ── Expandable group ── */
                <div>
                  <button
                    onClick={() => toggleGroup(item.title)}
                    className={cn(
                      "sidebar-nav-item",
                      (groupIsActive || groupOpen) && "sidebar-nav-item--active-group"
                    )}
                  >
                    <div className="sidebar-nav-item-inner">
                      <div className="sidebar-nav-icon-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.icon} alt="" className="sidebar-nav-icon" />
                      </div>
                      <span className="sidebar-nav-label">{item.title}</span>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ICON.chevron}
                      alt=""
                      className={cn(
                        "sidebar-chevron",
                        groupOpen ? "sidebar-chevron--open" : "sidebar-chevron--closed"
                      )}
                    />
                  </button>

                  {/* Sub-items */}
                  {groupOpen && (
                    <div className="sidebar-sub-items">
                      {item.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "sidebar-sub-item",
                            isActive(child.href) && "sidebar-sub-item--active"
                          )}
                        >
                          <span className="sidebar-sub-dot" />
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* ── Simple nav link ── */
                <Link
                  href={item.href!}
                  className={cn(
                    "sidebar-nav-item",
                    active && "sidebar-nav-item--active"
                  )}
                >
                  <div className="sidebar-nav-item-inner">
                    <div className={cn("sidebar-nav-icon-wrap", active && "sidebar-nav-icon-wrap--active")}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={active ? (item.activeIcon || item.icon) : item.icon} alt="" className="sidebar-nav-icon" />
                    </div>
                    <span className="sidebar-nav-label">{item.title}</span>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── App store badges ─────────────────────────────── */}
      <div className="sidebar-app-badges">
        <a href="#" className="sidebar-badge" aria-label="Download on App Store">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ICON.apple} alt="" className="sidebar-badge-icon" />
          <div className="sidebar-badge-text">
            <span className="sidebar-badge-small">Download on the</span>
            <span className="sidebar-badge-large">App Store</span>
          </div>
        </a>
        <a href="#" className="sidebar-badge" aria-label="Get it on Google Play">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ICON.googlePlay} alt="" className="sidebar-badge-icon sidebar-badge-icon--play" />
          <div className="sidebar-badge-text">
            <span className="sidebar-badge-small">GET IN ON</span>
            <span className="sidebar-badge-large">Google Play</span>
          </div>
        </a>
      </div>

      {/* ── Logout button (Refined Red) ──────────────────── */}
      <div className="sidebar-logout-wrap">
        <button
          onClick={() => {
            useAuthStore.getState().clearAuth();
            router.push("/auth/login");
          }}
          className="sidebar-logout-btn"
        >
          <div className="sidebar-logout-icons">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ICON.logoutIcon} alt="" className="sidebar-logout-icon" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ICON.logoutArrow} alt="" className="sidebar-logout-icon absolute ml-2 opacity-50" />
          </div>
          <span className="sidebar-logout-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
