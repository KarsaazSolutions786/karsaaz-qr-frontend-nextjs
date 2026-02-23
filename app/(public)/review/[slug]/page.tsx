import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReviewPreview from '@/components/public/business-review/ReviewPreview'
import { getQRCodeRedirect, trackQRView } from '@/lib/api/public-qrcodes'

async function getBusinessReview(slug: string) {
  try {
    const qrData = await getQRCodeRedirect(slug)
    
    // Validate type is business-review, review, or rating
    const validTypes = ['business-review', 'google-review', 'review', 'rating']
    if (!validTypes.includes(qrData.type)) {
      console.error(`Invalid QR type for business review: ${qrData.type}`)
      return null
    }
    
    // Track the view
    trackQRView(slug)
    
    return qrData.data
  } catch (error) {
    console.error('Failed to fetch business review:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const review = await getBusinessReview(params.slug)

  if (!review) {
    return {
      title: 'Review Not Found',
      description: 'The requested review page could not be found.',
    }
  }

  return {
    title: `Review ${review.businessName}`,
    description: review.reviewMessage || `Share your experience with ${review.businessName}. Your feedback helps us improve!`,
    openGraph: {
      title: `Review ${review.businessName}`,
      description: review.reviewMessage || `Share your experience with ${review.businessName}`,
      images: review.logo ? [review.logo] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Review ${review.businessName}`,
      description: review.reviewMessage || `Share your experience with ${review.businessName}`,
      images: review.logo ? [review.logo] : [],
    },
  }
}

export default async function PublicBusinessReviewPage({ params }: { params: { slug: string } }) {
  const review = await getBusinessReview(params.slug)

  if (!review) {
    notFound()
  }

  return <ReviewPreview review={review} />
}
