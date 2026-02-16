/**
 * Content Service
 * Admin CRUD for blog posts, pages, content blocks, translations, custom codes.
 */
import apiClient from "@/lib/api-client";

export const contentService = {
    // ─── Blog Posts ────────────────────────────────────────

    /** GET /api/blog-posts */
    getBlogPosts: async (params?: { page?: number; search?: string }) => {
        return apiClient.get("/blog-posts", params as any);
    },

    getBlogPost: async (id: string | number) => {
        return apiClient.get(`/blog-posts/${id}`);
    },

    createBlogPost: async (data: any) => {
        return apiClient.post("/blog-posts", data);
    },

    updateBlogPost: async (id: string | number, data: any) => {
        return apiClient.put(`/blog-posts/${id}`, data);
    },

    deleteBlogPost: async (id: string | number) => {
        return apiClient.delete(`/blog-posts/${id}`);
    },

    // ─── Pages ─────────────────────────────────────────────

    /** GET /api/pages */
    getPages: async (params?: { page?: number; search?: string }) => {
        return apiClient.get("/pages", params as any);
    },

    getPage: async (id: string | number) => {
        return apiClient.get(`/pages/${id}`);
    },

    createPage: async (data: any) => {
        return apiClient.post("/pages", data);
    },

    updatePage: async (id: string | number, data: any) => {
        return apiClient.put(`/pages/${id}`, data);
    },

    deletePage: async (id: string | number) => {
        return apiClient.delete(`/pages/${id}`);
    },

    // ─── Content Blocks ────────────────────────────────────

    /** GET /api/content-blocks */
    getContentBlocks: async (params?: { page?: number; search?: string }) => {
        return apiClient.get("/content-blocks", params as any);
    },

    getContentBlock: async (id: string | number) => {
        return apiClient.get(`/content-blocks/${id}`);
    },

    createContentBlock: async (data: any) => {
        return apiClient.post("/content-blocks", data);
    },

    updateContentBlock: async (id: string | number, data: any) => {
        return apiClient.put(`/content-blocks/${id}`, data);
    },

    deleteContentBlock: async (id: string | number) => {
        return apiClient.delete(`/content-blocks/${id}`);
    },

    // ─── Translations ─────────────────────────────────────

    /** GET /api/translations */
    getTranslations: async (params?: { page?: number; search?: string }) => {
        return apiClient.get("/translations", params as any);
    },

    getTranslation: async (id: string | number) => {
        return apiClient.get(`/translations/${id}`);
    },

    createTranslation: async (data: any) => {
        return apiClient.post("/translations", data);
    },

    updateTranslation: async (id: string | number, data: any) => {
        return apiClient.put(`/translations/${id}`, data);
    },

    deleteTranslation: async (id: string | number) => {
        return apiClient.delete(`/translations/${id}`);
    },

    // ─── Custom Codes ─────────────────────────────────────

    /** GET /api/custom-codes */
    getCustomCodes: async (params?: { page?: number; search?: string }) => {
        return apiClient.get("/custom-codes", params as any);
    },

    getCustomCode: async (id: string | number) => {
        return apiClient.get(`/custom-codes/${id}`);
    },

    createCustomCode: async (data: any) => {
        return apiClient.post("/custom-codes", data);
    },

    updateCustomCode: async (id: string | number, data: any) => {
        return apiClient.put(`/custom-codes/${id}`, data);
    },

    deleteCustomCode: async (id: string | number) => {
        return apiClient.delete(`/custom-codes/${id}`);
    },

    // ─── Dynamic Biolink Blocks ────────────────────────────

    /** GET /api/dynamic-biolink-blocks */
    getDynamicBiolinkBlocks: async (params?: { page?: number; search?: string }) => {
        return apiClient.get("/dynamic-biolink-blocks", params as any);
    },

    getDynamicBiolinkBlock: async (id: string | number) => {
        return apiClient.get(`/dynamic-biolink-blocks/${id}`);
    },

    createDynamicBiolinkBlock: async (data: any) => {
        return apiClient.post("/dynamic-biolink-blocks", data);
    },

    updateDynamicBiolinkBlock: async (id: string | number, data: any) => {
        return apiClient.put(`/dynamic-biolink-blocks/${id}`, data);
    },

    deleteDynamicBiolinkBlock: async (id: string | number) => {
        return apiClient.delete(`/dynamic-biolink-blocks/${id}`);
    },
};

export default contentService;
