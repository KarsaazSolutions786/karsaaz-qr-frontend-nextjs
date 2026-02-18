import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BusinessProfilePreview from '@/components/public/business-profile/BusinessProfilePreview'

async function getBusinessProfile(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/qrcodes/business-profile/${slug}`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
      return null
    }
    
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error('Failed to fetch business profile:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const profile = await getBusinessProfile(params.slug)

  if (!profile) {
    return {
      title: 'Business Not Found',
      description: 'The requested business profile could not be found.',
    }
  }

  return {
    title: `${profile.businessName} - Business Profile`,
    description: profile.tagline || `Visit ${profile.businessName}'s business profile to learn more about our services, team, and contact information.`,
    openGraph: {
      title: profile.businessName,
      description: profile.tagline || profile.businessName,
      images: profile.logo ? [profile.logo] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: profile.businessName,
      description: profile.tagline || profile.businessName,
      images: profile.logo ? [profile.logo] : [],
    },
  }
}

export default async function PublicBusinessProfilePage({ params }: { params: { slug: string } }) {
  const profile = await getBusinessProfile(params.slug)

  if (!profile) {
    notFound()
  }

  return <BusinessProfilePreview profile={profile} />
}
