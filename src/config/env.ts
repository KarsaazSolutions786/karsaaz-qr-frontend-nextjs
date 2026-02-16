export const env = {
  get: (key: string, defaultValue: any = null) => {
    // Check for standard environment variables first
    const envKey = `NEXT_PUBLIC_${key.toUpperCase().replace(/\./g, '_')}`;
    const value = process.env[envKey];

    if (value !== undefined) {
      return value;
    }

    // Mirroring legacy obfuscation logic if needed (checking window.CONFIG)
    if (typeof window !== 'undefined' && (window as any).CONFIG) {
      const config = (window as any).CONFIG;
      const configValue = config[key];

      if (configValue !== undefined) {
        // If it looks like base64 (production logic in legacy), decode it
        if (process.env.NODE_ENV === 'production' && typeof configValue === 'string') {
          try {
            return atob(configValue);
          } catch {
            return configValue;
          }
        }
        return configValue;
      }
    }

    return defaultValue;
  },

  isProduction: () => process.env.NODE_ENV === 'production',
  isDevelopment: () => process.env.NODE_ENV === 'development',
};

export default env;
