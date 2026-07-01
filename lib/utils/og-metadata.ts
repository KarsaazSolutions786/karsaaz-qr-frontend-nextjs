import type { Metadata } from 'next'
import { getCanonicalSiteUrl } from '@/lib/utils/site-url'

const SITE_NAME = 'Karsaaz QR'
const OG_IMAGE_PATH = '/og-default.svg'

export function generateOGMetadata(
  title: string,
  description: string,
  image?: string,
  path = '/'
): Metadata {
  const siteUrl = getCanonicalSiteUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const ogImage = image || `${siteUrl}${OG_IMAGE_PATH}`

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
