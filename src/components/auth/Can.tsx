"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";

interface CanProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ permission, children, fallback = null }: CanProps) {
  const { user } = useAuth();

  // Simple permission check logic
  // In a real app, you'd check user.roles or user.permissions array
  // Assuming user object has a permissions array of strings or objects with slug
  
  const hasPermission = () => {
    if (!user) return false;
    
    // Check if user is super admin (bypass all checks)
    const isSuperAdmin = user.roles?.some((role: { name: string }) => role.name === "Super Admin");
    if (isSuperAdmin) return true;

    // Check specific permission
    // This depends on the structure of the user object from the API
    // Based on documentation: user.roles[].permissions[].slug
    
    if (user.roles) {
      return user.roles.some((role: { permissions?: { slug: string }[] }) => 
        role.permissions?.some((p: { slug: string }) => p.slug === permission)
      );
    }

    return false;
  };

  if (hasPermission()) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
