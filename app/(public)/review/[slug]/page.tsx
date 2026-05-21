import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReviewPreview from '@/components/public/business-review/ReviewPreview'
import GoogleReviewPreview from '@/components/public/google-review/GoogleReviewPreview'
import { getQRCodeRedirect, trackQRView } from '@/lib/api/public-qrcodes'

const BUSINESS_REVIEW_TYPES = ['business-review', 'review', 'rating']
const GOOGLE_REVIEW_TYPES = ['google-review']
const ALL_REVIEW_TYPES = [...BUSINESS_REVIEW_TYPES, ...GOOGLE_REVIEW_TYPES]

/**
 * Purpose: Retrieves reviewdata.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
async function getReviewData(slug: string) {
  try {
    const qrData = await getQRCodeRedirect(slug)

    if (!ALL_REVIEW_TYPES.includes(qrData.type)) {
      console.error(`Invalid QR type for review page: ${qrData.type}`)
      return null
    }

    trackQRView(slug)

    return { type: qrData.type as string, data: qrData.data }
  } catch (error) {
    console.error('Failed to fetch review data:', error)
    return null
  }
}

/**
 * Purpose: Executes generateMetadata functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = await getReviewData(params.slug)

  if (!result) {
    return {
      title: 'Review Not Found',
      description: 'The requested review page could not be found.',
    }
  }

  const { data } = result
  const businessName = data.businessName || data.business_name || 'Business'
  const description = data.reviewMessage || data.customMessage || `Share your experience with ${businessName}. Your feedback helps us improve!`

  return {
    title: `Review ${businessName}`,
    description,
    openGraph: {
      title: `Review ${businessName}`,
      description,
      images: data.logo ? [data.logo] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Review ${businessName}`,
      description,
      images: data.logo ? [data.logo] : [],
    },
  }
}

/**
 * Purpose: Executes PublicReviewPage functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
export default async function PublicReviewPage({ params }: { params: { slug: string } }) {
  const result = await getReviewData(params.slug)

  if (!result) {
    notFound()
  }

  if (GOOGLE_REVIEW_TYPES.includes(result.type)) {
    return <GoogleReviewPreview data={result.data} />
  }

  return <ReviewPreview review={result.data} />
}
