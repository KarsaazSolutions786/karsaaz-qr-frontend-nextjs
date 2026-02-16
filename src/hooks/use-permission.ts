import { useAuthStore } from '@/store/useAuthStore';

export function usePermission() {
  const { user } = useAuthStore();

  const loggedIn = () => !!user;

  const verified = () => !!user?.email_verified_at;

  const isSuperAdmin = () => {
    if (!user || !user.roles) return false;
    return user.roles.some((role) => role.super_admin);
  };

  const isClient = () => {
    if (!user || !user.roles) return false;
    return user.roles.some((role) => role.name === 'Client');
  };

  const isSubUser = () => !!user?.is_sub;

  const permitted = (slug: string) => {
    if (!slug) return true;
    if (!user || !user.roles) return false;

    // Super Admin bypass
    if (isSuperAdmin()) return true;

    // Must be verified for other permissions
    if (!verified()) return false;

    // Check all roles for the permission slug
    return user.roles.some((role) => 
      role.permissions?.some((p) => p.slug === slug)
    );
  };

  const userHomePage = () => {
    if (!user || !user.roles || !user.roles[0]) return '/';
    return user.roles[0].home_page || '/dashboard';
  };

  return {
    loggedIn,
    verified,
    isSuperAdmin,
    isClient,
    isSubUser,
    permitted,
    userHomePage,
  };
}
