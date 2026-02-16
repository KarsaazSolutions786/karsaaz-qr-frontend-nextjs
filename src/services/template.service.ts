/**
 * Template Service
 * CRUD for QR code templates and template categories.
 */
import apiClient from "@/lib/api-client";

export interface QRTemplate {
    id: string | number;
    name: string;
    type: string;
    design: any;
    category_id?: string | number;
    is_public: boolean;
    created_at?: string;
}

export interface TemplateCategory {
    id: string | number;
    name: string;
    slug: string;
    templates_count?: number;
}

export const templateService = {
    // ─── Templates ─────────────────────────────────────────

    /** GET /api/qrcode-templates */
    getTemplates: async (params?: { page?: number; search?: string; category_id?: string | number }) => {
        return apiClient.get("/qrcode-templates", params as any);
    },

    /** GET /api/qrcode-templates/{id} */
    getTemplate: async (id: string | number) => {
        return apiClient.get(`/qrcode-templates/${id}`);
    },

    /** POST /api/qrcode-templates */
    createTemplate: async (data: Partial<QRTemplate>) => {
        return apiClient.post("/qrcode-templates", data);
    },

    /** PUT /api/qrcode-templates/{id} */
    updateTemplate: async (id: string | number, data: Partial<QRTemplate>) => {
        return apiClient.put(`/qrcode-templates/${id}`, data);
    },

    /** DELETE /api/qrcode-templates/{id} */
    deleteTemplate: async (id: string | number) => {
        return apiClient.delete(`/qrcode-templates/${id}`);
    },

    /** POST /api/qrcode-templates/{id}/use-in-existing — Apply template to existing QR */
    useInExisting: async (templateId: string | number, qrcodeId: string | number) => {
        return apiClient.post(`/qrcode-templates/${templateId}/use-in-existing`, { qrcode_id: qrcodeId });
    },

    // ─── Template Categories ───────────────────────────────

    /** GET /api/template-categories */
    getCategories: async (params?: { page?: number; search?: string }) => {
        return apiClient.get("/template-categories", params as any);
    },

    /** GET /api/template-categories/{id} */
    getCategory: async (id: string | number) => {
        return apiClient.get(`/template-categories/${id}`);
    },

    /** POST /api/template-categories */
    createCategory: async (data: Partial<TemplateCategory>) => {
        return apiClient.post("/template-categories", data);
    },

    /** PUT /api/template-categories/{id} */
    updateCategory: async (id: string | number, data: Partial<TemplateCategory>) => {
        return apiClient.put(`/template-categories/${id}`, data);
    },

    /** DELETE /api/template-categories/{id} */
    deleteCategory: async (id: string | number) => {
        return apiClient.delete(`/template-categories/${id}`);
    },
};

export default templateService;
