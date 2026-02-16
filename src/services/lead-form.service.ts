/**
 * Lead Form Service
 * CRUD for lead forms used in QR code landing pages.
 */
import apiClient from "@/lib/api-client";

export const leadFormService = {
    /** GET /api/lead-forms */
    getAll: async (params?: { page?: number; search?: string }) => {
        return apiClient.get("/lead-forms", params as any);
    },

    /** GET /api/lead-forms/{id} */
    getOne: async (id: string | number) => {
        return apiClient.get(`/lead-forms/${id}`);
    },

    /** POST /api/lead-forms */
    create: async (data: any) => {
        return apiClient.post("/lead-forms", data);
    },

    /** PUT /api/lead-forms/{id} */
    update: async (id: string | number, data: any) => {
        return apiClient.put(`/lead-forms/${id}`, data);
    },

    /** DELETE /api/lead-forms/{id} */
    delete: async (id: string | number) => {
        return apiClient.delete(`/lead-forms/${id}`);
    },

    // ─── Responses ─────────────────────────────────────────

    /** GET /api/lead-form-responses?lead_form_id={id} — Responses for a lead form */
    getResponses: async (params?: { lead_form_id?: string | number; page?: number }) => {
        return apiClient.get("/lead-form-responses", params as any);
    },

    /** DELETE /api/lead-form-responses/{id} — Delete a response */
    deleteResponse: async (responseId: string | number) => {
        return apiClient.delete(`/lead-form-responses/${responseId}`);
    },
};

export default leadFormService;
