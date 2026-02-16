/**
 * App Config
 * Provides access to runtime application configuration.
 * In Next.js, config comes from environment variables (NEXT_PUBLIC_*).
 * This module provides a unified accessor with type coercion,
 * mirroring qr-code-frontend/src/core/qrcg-config.js
 */

type ConfigType = typeof String | typeof Number | typeof Boolean;

export const AppConfig = {
    /**
     * Get a configuration value by key.
     * Checks NEXT_PUBLIC_ prefixed env vars.
     */
    get(key: string, type: ConfigType = String): any {
        // Try NEXT_PUBLIC_ prefix first
        const envKey = key.startsWith("NEXT_PUBLIC_") ? key : `NEXT_PUBLIC_${key.toUpperCase()}`;
        const value = process.env[envKey] ?? process.env[key] ?? undefined;

        if (value === undefined) return undefined;

        if (type === Boolean) {
            return value === "true" || value === "1";
        }

        if (type === Number) {
            const num = Number(value);
            return isNaN(num) ? undefined : num;
        }

        // Try JSON parse for objects/arrays
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    },

    /** Convenience: Get the API base URL */
    apiUrl(): string {
        return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    },

    /** Convenience: Get the app base URL */
    appUrl(): string {
        return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    },

    /** Convenience: Is app in development mode */
    isDev(): boolean {
        return process.env.NODE_ENV === "development";
    },

    /** Convenience: Is app in production mode */
    isProd(): boolean {
        return process.env.NODE_ENV === "production";
    },

    /** Convenience: Get the Stripe publishable key */
    stripeKey(): string | undefined {
        return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    },
};

export default AppConfig;
