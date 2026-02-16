/**
 * Role Service
 * Admin CRUD for roles and permissions.
 */
import apiClient from "@/lib/api-client";

export interface Role {
    id: string | number;
    name: string;
    super_admin: boolean;
    home_page: string;
    permissions: { id: string | number; slug: string; name: string }[];
}

export const roleService = {
    /** GET /api/roles */
    getAll: async (params?: { page?: number; search?: string }) => {
        return apiClient.get("/roles", params as any);
    },

    /** GET /api/roles/{id} */
    getOne: async (id: string | number) => {
        return apiClient.get(`/roles/${id}`);
    },

    /** POST /api/roles */
    create: async (data: Partial<Role>) => {
        return apiClient.post("/roles", data);
    },

    /** PUT /api/roles/{id} */
    update: async (id: string | number, data: Partial<Role>) => {
        return apiClient.put(`/roles/${id}`, data);
    },

    /** DELETE /api/roles/{id} */
    delete: async (id: string | number) => {
        return apiClient.delete(`/roles/${id}`);
    },
};

export default roleService;
