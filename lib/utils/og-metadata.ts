import type { Metadata } from 'next'
import { envConfig } from '@/lib/config/env-config'

const SITE_NAME = 'Karsaaz QR'

function getCanonicalSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_CANONICAL_URL || process.env.NEXT_PUBLIC_APP_URL || envConfig.APP_URL

  // Production OG images should resolve on the marketing www host, not app subdomain
  if (!process.env.NEXT_PUBLIC_CANONICAL_URL && /app\.karsaazqr\.com/i.test(fromEnv)) {
    return 'https://www.karsaazqr.com'
  }

  return fromEnv.replace(/\/$/, '')
}

export function generateOGMetadata(
  title: string,
  description: string,
  image?: string,
  path = '/'
): Metadata {
  const siteUrl = getCanonicalSiteUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const ogImage = image || `${siteUrl}/og-default.svg`

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}${normalizedPath}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${normalizedPath}`,
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
