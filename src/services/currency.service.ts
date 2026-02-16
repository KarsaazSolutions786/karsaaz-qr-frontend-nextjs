/**
 * Currency Service
 * Admin CRUD for currencies.
 */
import apiClient from "@/lib/api-client";

export interface Currency {
    id: string | number;
    name: string;
    code: string;
    symbol: string;
    is_default: boolean;
}

export const currencyService = {
    /** GET /api/currencies */
    getAll: async (params?: { page?: number; search?: string }) => {
        return apiClient.get("/currencies", params as any);
    },

    /** GET /api/currencies/{id} */
    getOne: async (id: string | number) => {
        return apiClient.get(`/currencies/${id}`);
    },

    /** POST /api/currencies */
    create: async (data: Partial<Currency>) => {
        return apiClient.post("/currencies", data);
    },

    /** PUT /api/currencies/{id} */
    update: async (id: string | number, data: Partial<Currency>) => {
        return apiClient.put(`/currencies/${id}`, data);
    },

    /** DELETE /api/currencies/{id} */
    delete: async (id: string | number) => {
        return apiClient.delete(`/currencies/${id}`);
    },
};

export default currencyService;
