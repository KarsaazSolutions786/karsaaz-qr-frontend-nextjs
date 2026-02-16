/**
 * Domain Service
 * Admin CRUD for custom domains.
 */
import apiClient from "@/lib/api-client";

export interface Domain {
    id: string | number;
    name: string;
    is_verified: boolean;
    dns_records: any[];
    created_at?: string;
}

export const domainService = {
    /** GET /api/domains */
    getAll: async (params?: { page?: number; search?: string }) => {
        return apiClient.get("/domains", params as any);
    },

    /** GET /api/domains/{id} */
    getOne: async (id: string | number) => {
        return apiClient.get(`/domains/${id}`);
    },

    /** POST /api/domains */
    create: async (data: Partial<Domain>) => {
        return apiClient.post("/domains", data);
    },

    /** PUT /api/domains/{id} */
    update: async (id: string | number, data: Partial<Domain>) => {
        return apiClient.put(`/domains/${id}`, data);
    },

    /** DELETE /api/domains/{id} */
    delete: async (id: string | number) => {
        return apiClient.delete(`/domains/${id}`);
    },

    /** GET /api/domains/my-domains — User's own domains */
    getMyDomains: async () => {
        return apiClient.get("/domains/my-domains");
    },

    /** PUT /api/domains/{id}/update-status — Toggle domain status */
    updateStatus: async (id: string | number, status: { status: string }) => {
        return apiClient.put(`/domains/${id}/update-status`, status);
    },

    /** GET /api/domains/{id}/check-connectivity — Check DNS and reachability */
    checkConnectivity: async (id: string | number) => {
        return apiClient.get(`/domains/${id}/check-connectivity`);
    },

    /** GET /api/domains/usable — Domains usable for QR creation */
    getUsable: async () => {
        return apiClient.get("/domains/usable");
    },
};

export default domainService;
