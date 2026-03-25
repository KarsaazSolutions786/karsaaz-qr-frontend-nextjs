import type { Metadata } from 'next'
import { envConfig } from '@/lib/config/env-config'

const SITE_URL = envConfig.APP_URL
const SITE_NAME = 'Karsaaz QR'

/**
 * Generate Open Graph metadata for any page.
 * Merge the result into your page's metadata export.
 */
export function generateOGMetadata(
  title: string,
  description: string,
  image?: string,
  path = '/'
): Metadata {
  const ogImage = image || `${SITE_URL}/og-default.png`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}
