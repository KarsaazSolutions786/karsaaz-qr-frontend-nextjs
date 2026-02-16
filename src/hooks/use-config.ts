/**
 * useConfig Hook
 * React-friendly wrapper around the AppConfig module.
 * Also provides "system settings" from the API (/settings or /system-settings).
 */
"use client";

import apiClient from "@/lib/api-client";
import AppConfig from "@/lib/config";
import { loadStoredJson, storeJson } from "@/lib/helpers";
import { useCallback, useState } from "react";

const SETTINGS_CACHE_KEY = "app:settings";

export function useConfig() {
    const [settings, setSettings] = useState<Record<string, any>>(
        () => loadStoredJson<Record<string, any>>(SETTINGS_CACHE_KEY) || {}
    );
    const [loading, setLoading] = useState(false);

    /** Fetch system settings from API and cache them */
    const loadSettings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get("/settings");
            const data = res?.data ?? res;
            if (data && typeof data === "object") {
                setSettings(data);
                storeJson(data, SETTINGS_CACHE_KEY);
            }
        } catch {
            // Use cached settings silently
        } finally {
            setLoading(false);
        }
    }, []);

    /** Get a specific setting value with optional default */
    const getSetting = useCallback(
        (key: string, defaultValue?: any) => {
            return settings[key] ?? defaultValue;
        },
        [settings]
    );

    return {
        // Static config from env
        config: AppConfig,
        apiUrl: AppConfig.apiUrl(),
        appUrl: AppConfig.appUrl(),
        isDev: AppConfig.isDev(),
        isProd: AppConfig.isProd(),

        // Dynamic settings from API
        settings,
        loading,
        loadSettings,
        getSetting,
    };
}

export default useConfig;
