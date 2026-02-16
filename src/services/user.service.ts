/**
 * User Service
 * Profile management, password updates, admin user management, sub-users, impersonation.
 * Consolidated from user-service.ts + admin.service.ts
 */
import apiClient from "@/lib/api-client";

export interface User {
    id: string | number;
    name: string;
    email: string;
    email_verified_at?: string;
    is_sub?: boolean;
    parent_user?: { roles: { name: string; super_admin: boolean; home_page: string; permissions: { slug: string }[] }[] };
    roles: {
        name: string;
        super_admin: boolean;
        home_page: string;
        permissions: { slug: string }[];
    }[];
    subscriptions?: {
        id: string | number;
        status: string;
        expires_at: string;
        trial_ends_at?: string;
        created_at: string;
        subscription_plan: {
            id: string | number;
            name: string;
            description?: string;
            price: number;
            currency: string;
            frequency: string;
            is_trial: boolean;
            trial_days: number;
            features: string[];
            qr_types: string[];
            number_of_users: number;
        };
    }[];
    latest_subscription_plan?: {
        id: string | number;
        name: string;
        description?: string;
        price: number;
        currency: string;
        frequency: string;
        is_trial: boolean;
        trial_days: number;
        features: string[];
        qr_types: string[];
        number_of_users: number;
    };
    created_at?: string;
    updated_at?: string;
}

export const userService = {
    // ─── Self ──────────────────────────────────────────────

    /** GET /api/myself — Validate token, refresh user data */
    getMyself: async () => {
        return apiClient.get("/myself");
    },

    /** PUT /api/users/{id} — Update profile */
    updateProfile: async (userId: string | number, data: { name?: string; email?: string }): Promise<User> => {
        return apiClient.put(`/users/${userId}`, data);
    },

    /** PUT /api/users/{id}/password — Update password */
    updatePassword: async (userId: string | number, data: { current_password?: string; password: string; password_confirmation: string }) => {
        return apiClient.put(`/users/${userId}/password`, data);
    },

    // ─── Admin: User Management ────────────────────────────

    /** GET /api/users?page=&search= — List all users */
    getAllUsers: async (params?: { page?: number; search?: string; paying?: boolean }): Promise<{ data: User[]; total: number; last_page: number; current_page: number }> => {
        return apiClient.get("/users", params as any);
    },

    /** POST /api/users — Create user */
    createUser: async (data: { name: string; email: string; password?: string; roles?: string[] }): Promise<User> => {
        return apiClient.post("/users", data);
    },

    /** GET /api/users/{id} */
    getUser: async (id: string | number) => {
        return apiClient.get(`/users/${id}`);
    },

    /** PUT /api/users/{id} */
    updateUser: async (id: string | number, data: { name?: string; email?: string; roles?: string[] }): Promise<User> => {
        return apiClient.put(`/users/${id}`, data);
    },

    /** DELETE /api/users/{id} */
    deleteUser: async (id: string | number) => {
        return apiClient.delete(`/users/${id}`);
    },

    /** POST /api/users/{id}/act-as — Impersonate user (Super Admin only) */
    actAs: async (userId: string | number): Promise<{ token: string; user: User }> => {
        return apiClient.post(`/users/${userId}/act-as`);
    },

    // ─── Sub-Users ─────────────────────────────────────────

    /** GET /api/users/{userId}/sub-users */
    getSubUsers: async (userId: string | number) => {
        return apiClient.get(`/users/${userId}/sub-users`);
    },

    /** POST /api/users/{userId}/invite-sub-user */
    inviteSubUser: async (userId: string | number, data: { name?: string; email: string; folder_id?: string[] | string }) => {
        return apiClient.post(`/users/${userId}/invite-sub-user`, data);
    },

    /** POST /api/users/{userId}/sub-users/{subUserId}/update-folders */
    updateSubUserFolders: async (userId: string | number, subUserId: string | number, folderIds: string[]) => {
        return apiClient.post(`/users/${userId}/sub-users/${subUserId}/update-folders`, { folder_ids: folderIds });
    },

    /** DELETE /api/users/{userId}/sub-users/{subUserId} */
    deleteSubUser: async (userId: string | number, subUserId: string | number) => {
        return apiClient.delete(`/users/${userId}/sub-users/${subUserId}`);
    },

    // ─── Admin Actions ─────────────────────────────────────

    /** POST /api/users/{id}/reset-role — Reset user role to default */
    resetRole: async (userId: string | number) => {
        return apiClient.post(`/users/${userId}/reset-role`);
    },

    /** POST /api/users/{id}/reset-scans-limit — Reset user scans limit */
    resetScansLimit: async (userId: string | number) => {
        return apiClient.post(`/users/${userId}/reset-scans-limit`);
    },

    /** POST /api/users/{id}/reset-qrcodes-limit — Reset user QR code limit */
    resetQRCodeLimit: async (userId: string | number) => {
        return apiClient.post(`/users/${userId}/reset-qrcodes-limit`);
    },

    /** POST /api/users/verify-email/{id} — Admin verify user email */
    verifyEmail: async (userId: string | number) => {
        return apiClient.post(`/users/verify-email/${userId}`);
    },

    /** POST /api/users/{id}/update-account-balance — Update user account balance */
    updateAccountBalance: async (userId: string | number, amount: number) => {
        return apiClient.post(`/users/${userId}/update-account-balance`, { account_balance: amount });
    },

    /** GET /api/users/{id}/account-balance — Get user account balance */
    getAccountBalance: async (userId: string | number): Promise<{ balance: number }> => {
        return apiClient.get(`/users/${userId}/account-balance`);
    },
};

export default userService;
