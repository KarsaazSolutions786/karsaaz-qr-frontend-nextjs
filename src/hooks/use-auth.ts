import { usePermission } from "@/hooks/use-permission";
import apiClient from "@/lib/api-client";
import authService from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();
  const { user, token, setAuth, clearAuth, setUser } = useAuthStore();
  const { userHomePage } = usePermission();

  const login = async (credentials: { email: string; password?: string }) => {
    try {
      const response = await authService.login(credentials);

      // Match Laravel standard response structure
      const responseToken = response.token || response.access_token;
      const responseUser = response.user || response.data;

      if (responseToken && responseUser) {
        setAuth(responseUser, responseToken);
        toast.success("Logged in successfully");

        const redirectPath = userHomePage();
        router.refresh();
        router.push(redirectPath);
        return true;
      }
      return true;
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || "Failed to login");
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (_error: unknown) {
      console.error("Logout failed:", error);
    } finally {
      clearAuth();
      router.push("/login");
      toast.success("Logged out successfully");
    }
  };

  const validateSession = async () => {
    if (!token) return null;

    try {
      const response = await apiClient.get("myself");
      setUser(response);
      return response;
    } catch (_error: unknown) {
      console.error("Session validation failed:", error);
      clearAuth();
      return null;
    }
  };

  /** Re-fetch and update user data from API (alias for validateSession) */
  const refreshUser = async () => {
    try {
      const response = await apiClient.get("myself");
      setUser(response);
      return response;
    } catch (_error: unknown) {
      console.error("Failed to refresh user:", error);
      return null;
    }
  };

  return {
    user,
    token,
    loggedIn: !!user && !!token,
    login,
    logout,
    validateSession,
    refreshUser,
  };
}