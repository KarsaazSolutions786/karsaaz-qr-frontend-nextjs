/**
 * Contact Service
 * CRUD for contact form submissions.
 */
import apiClient from "@/lib/api-client";

export const contactService = {
    /** GET /api/contacts */
    getAll: async (params?: { page?: number; search?: string }) => {
        return apiClient.get("/contacts", params as any);
    },

    /** GET /api/contacts/{id} */
    getOne: async (id: string | number) => {
        return apiClient.get(`/contacts/${id}`);
    },

    /** POST /api/contacts */
    create: async (data: any) => {
        return apiClient.post("/contacts", data);
    },

    /** PUT /api/contacts/{id} */
    update: async (id: string | number, data: any) => {
        return apiClient.put(`/contacts/${id}`, data);
    },

    /** DELETE /api/contacts/{id} */
    delete: async (id: string | number) => {
        return apiClient.delete(`/contacts/${id}`);
    },
};

export default contactService;
