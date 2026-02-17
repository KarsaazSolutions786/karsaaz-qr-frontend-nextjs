/**
 * Installation Service
 * Handles the multi-step system installation wizard.
 * Fully synced with Laravel backend API.
 */
import apiClient from "@/lib/api-client";

export const installService = {
  /** POST /api/install/verify-purchase-code — Verify Envato license key */
  verifyPurchaseCode: async (purchase_code: string) => {
    return apiClient.post("/install/verify-purchase-code", { purchase_code });
  },

  /** POST /api/install/verify-database — Test database connection */
  verifyDatabase: async (data: Record<string, any>) => {
    return apiClient.post("/install/verify-database", data);
  },

  /** POST /api/install/verify-mail — Send test email to verify SMTP */
  verifyMail: async (data: Record<string, any>) => {
    return apiClient.post("/install/verify-mail", data);
  },

  /** POST /api/install/save — Save configuration for a specific step */
  saveStep: async (data: Record<string, any>) => {
    return apiClient.post("/install/save", data);
  },

  /** POST /api/install/complete — Finalize installation */
  complete: async () => {
    return apiClient.post("/install/complete");
  },
};

export default installService;
