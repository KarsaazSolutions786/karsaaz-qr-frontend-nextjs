import type { MetadataRoute } from 'next'
import { envConfig } from '@/lib/config/env-config'

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
