/**
 * Impersonation Hook
 * Mirrors qr-code-frontend/src/core/auth.js actAs/removeActingAs/isActingAs
 *
 * Allows super admins to "act as" another user,
 * storing the original admin credentials to restore later.
 */
import { usePermission } from "@/hooks/use-permission";
import { authUtils } from "@/lib/auth-utils";
import userService from "@/services/user.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ACTING_AS_KEY = "auth:acting_as";

export function useImpersonation() {
    const router = useRouter();
    const { user, token, setAuth, clearAuth } = useAuthStore();
    const { isSuperAdmin } = usePermission();

    /** Check if currently impersonating another user */
    const isActingAs = (): boolean => {
        if (typeof window === "undefined") return false;
        return !!localStorage.getItem(ACTING_AS_KEY);
    };

    /** Start impersonating a user by ID */
    const actAs = async (userId: string | number): Promise<boolean> => {
        if (!isSuperAdmin()) {
            toast.error("Only super admins can impersonate users");
            return false;
        }

        try {
            // Store current admin credentials before switching
            if (user && token) {
                localStorage.setItem(
                    ACTING_AS_KEY,
                    JSON.stringify({ user, token })
                );
            }

            // Call API to get impersonation token
            const res = await userService.actAs(userId);
            const data = res.data ?? res;
            const newToken = data.token || data.access_token;
            const newUser = data.user || data.data;

            if (newToken && newUser) {
                setAuth(newUser, newToken);
                authUtils.setToken(newToken);
                toast.success(`Now acting as ${newUser.name || newUser.email}`);
                router.push("/dashboard");
                return true;
            }

            return false;
        } catch (err: any) {
            toast.error(err?.message || "Failed to impersonate user");
            // Clean up on failure
            localStorage.removeItem(ACTING_AS_KEY);
            return false;
        }
    };

    /** Stop impersonating and restore original admin session */
    const stopActingAs = (): void => {
        const stored = localStorage.getItem(ACTING_AS_KEY);
        if (!stored) return;

        try {
            const { user: adminUser, token: adminToken } = JSON.parse(stored);
            setAuth(adminUser, adminToken);
            authUtils.setToken(adminToken);
            localStorage.removeItem(ACTING_AS_KEY);
            toast.success("Returned to admin session");
            router.push("/dashboard");
        } catch {
            // If restore fails, force logout
            clearAuth();
            authUtils.removeToken();
            localStorage.removeItem(ACTING_AS_KEY);
            router.push("/login");
        }
    };

    return {
        isActingAs,
        actAs,
        stopActingAs,
    };
}
