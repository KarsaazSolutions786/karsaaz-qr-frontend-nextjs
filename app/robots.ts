import type { MetadataRoute } from 'next'
import { envConfig } from '@/lib/config/env-config'

/**
 * Purpose: Executes robots functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = envConfig.APP_URL

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/account/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
