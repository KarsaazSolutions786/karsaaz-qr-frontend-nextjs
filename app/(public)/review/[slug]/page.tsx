import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReviewPreview from '@/components/public/business-review/ReviewPreview'

async function getBusinessReview(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/qrcodes/business-review/${slug}`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
      return null
    }
    
    const data = await res.json()
    return data.data
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
