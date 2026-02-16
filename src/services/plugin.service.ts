/**
 * Plugin Service
 * Admin management of available and installed plugins.
 */
import apiClient from "@/lib/api-client";

export interface Plugin {
    id: string;
    name: string;
    description: string;
    version: string;
    is_installed: boolean;
    is_active: boolean;
}

export const pluginService = {
    /** GET /api/plugins/available */
    getAvailable: async () => {
        return apiClient.get("/plugins/available");
    },

    /** GET /api/plugins/installed */
    getInstalled: async () => {
        return apiClient.get("/plugins/installed");
    },

    /** POST /api/plugins/install */
    install: async (pluginId: string) => {
        return apiClient.post("/plugins/install", { plugin_id: pluginId });
    },

    /** POST /api/plugins/uninstall */
    uninstall: async (pluginId: string) => {
        return apiClient.post("/plugins/uninstall", { plugin_id: pluginId });
    },

    /** POST /api/plugins/activate */
    activate: async (pluginId: string) => {
        return apiClient.post("/plugins/activate", { plugin_id: pluginId });
    },

    /** POST /api/plugins/deactivate */
    deactivate: async (pluginId: string) => {
        return apiClient.post("/plugins/deactivate", { plugin_id: pluginId });
    },

    /** GET /api/plugins/plugin/{slug} — Get plugin details by slug */
    getPlugin: async (slug: string) => {
        return apiClient.get(`/plugins/plugin/${slug}`);
    },
};

export default pluginService;
