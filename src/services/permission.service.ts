/**
 * Permission Service
 * Fetch available permissions for role assignment.
 */
import apiClient from "@/lib/api-client";

export const permissionService = {
    /** GET /api/permissions — List all available permissions */
    getAll: async () => {
        return apiClient.get("/permissions");
    },
};

export default permissionService;
