/**
 * Translation System
 * Mirrors qr-code-frontend/src/core/translate.js
 *
 * The original frontend stores translation maps in window.QRCG_TRANSLATION.
 * In Next.js, we fetch translations at runtime and cache them.
 * Provides a `t()` function for template literal-based lookups.
 */
import apiClient from "./api-client";
import { isEmpty, loadStoredJson, storeJson } from "./helpers";

const STORAGE_KEY = "qrcg:translations";
let translationMap: Record<string, string> = {};
let loaded = false;

/**
 * Load translations from the API or localStorage cache.
 * Should be called once at app startup.
 */
export async function loadTranslations(locale?: string): Promise<void> {
    // Try cache first
    const cached = loadStoredJson<Record<string, string>>(STORAGE_KEY);
    if (cached && !isEmpty(cached)) {
        translationMap = cached;
        loaded = true;
    }

    // Fetch fresh translations from API
    try {
        const params = locale ? { locale } : undefined;
        const res = await apiClient.get("/translations", params);
        const data = res?.data ?? res;
        if (data && typeof data === "object") {
            translationMap = data;
            storeJson(translationMap, STORAGE_KEY);
            loaded = true;
        }
    } catch {
        // Use cached or fallback to key passthrough
    }
}

/**
 * Translate a key. Supports template literal syntax:
 *   t`Hello ${name}` or t("Hello World")
 *
 * Falls back to the key itself if no translation found.
 */
export function t(key: string | TemplateStringsArray, ...rest: any[]): string {
    // Handle template literal syntax: t`string ${var}`
    if (Array.isArray(key)) {
        const templateParts = key as unknown as TemplateStringsArray;
        const fullKey = templateParts
            .map((part, i) => part + (rest[i] !== undefined ? rest[i] : ""))
            .join("");
        return translationMap[fullKey] || fullKey;
    }

    // Simple string key
    const stringKey = key as string;
    if (isEmpty(translationMap) || isEmpty(translationMap[stringKey])) {
        return stringKey;
    }

    return translationMap[stringKey];
}

/**
 * Check if translations are loaded.
 */
export function translationsLoaded(): boolean {
    return loaded;
}

/**
 * Clear cached translations (useful after language switch).
 */
export function clearTranslationCache(): void {
    if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
    }
    translationMap = {};
    loaded = false;
}

export default t;
