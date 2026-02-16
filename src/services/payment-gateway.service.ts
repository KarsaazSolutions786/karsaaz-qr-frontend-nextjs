/**
 * Payment Gateway Service
 * Admin CRUD for payment processor configurations.
 */
import apiClient from "@/lib/api-client";

export const paymentGatewayService = {
    /** GET /api/payment-gateways */
    getAll: async () => {
        return apiClient.get("/payment-gateways");
    },

    /** GET /api/payment-gateways/{id} */
    getOne: async (id: string | number) => {
        return apiClient.get(`/payment-gateways/${id}`);
    },

    /** POST /api/payment-gateways */
    create: async (data: any) => {
        return apiClient.post("/payment-gateways", data);
    },

    /** PUT /api/payment-gateways/{id} */
    update: async (id: string | number, data: any) => {
        return apiClient.put(`/payment-gateways/${id}`, data);
    },

    /** DELETE /api/payment-gateways/{id} */
    delete: async (id: string | number) => {
        return apiClient.delete(`/payment-gateways/${id}`);
    },
};

export default paymentGatewayService;
