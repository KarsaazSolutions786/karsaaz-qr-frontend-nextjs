import type { BlogPost } from '@/types/entities/blog-post'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.karsaazqr.com'

/**
 * Generate Article (BlogPosting) JSON-LD schema for a blog post.
 */
export function blogPostSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.metaDescription || '',
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    ...(post.featuredImageId && {
      image: `${SITE_URL}/api/blog-posts/${post.id}/featured-image`,
    }),
    author: {
      '@type': 'Organization',
      name: 'Karsaaz QR',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Karsaaz QR',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.id}`,
    },
  }
}

/**
 * Generate Organization JSON-LD schema.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Karsaaz QR',
    url: SITE_URL,
    description:
      'QR Code Management Platform — create, manage, and track QR codes with advanced analytics.',
    sameAs: [],
  }
}

/**
 * Generate SoftwareApplication JSON-LD schema.
 */
export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Karsaaz QR',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description: 'Create, manage, and track QR codes with advanced analytics and customization.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available',
    },
  }
}
