"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Header() {
  const { toggleSidebar, user, logout } = useStore();
  const { theme, setTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <button
        onClick={toggleSidebar}
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:text-gray-300 min-w-[2rem] text-center"
        >
          {mounted ? (theme === "dark" ? "🌞" : "🌙") : "🌙"} 
        </button>
        
        <button className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:text-gray-300">
          <Bell className="h-6 w-6" />
        </button>

        <div className="relative ml-3">
          <div>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800"
            >
              <span className="sr-only">Open user menu</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                <User className="h-5 w-5" />
              </div>
            </button>
          </div>
          {isProfileOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
              <div className="border-b px-4 py-2 dark:border-gray-600">
                <p className="text-sm text-gray-700 dark:text-white font-medium">
                  {user?.name || "User Name"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <Link
                href="/account/my-account"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={() => setIsProfileOpen(false)}
              >
                Your Profile
              </Link>
              <Link
                href="/account/account-details"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={() => setIsProfileOpen(false)}
              >
                Account Details
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsProfileOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}