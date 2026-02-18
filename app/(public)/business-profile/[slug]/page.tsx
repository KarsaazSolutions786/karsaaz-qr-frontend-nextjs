import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BusinessProfilePreview from '@/components/public/business-profile/BusinessProfilePreview'
import { getQRCodeRedirect } from '@/lib/api/public-qrcodes'

async function getBusinessProfile(slug: string) {
  try {
    const qrData = await getQRCodeRedirect(slug)
    
    if (!qrData) {
      return null
    }
    
    // Validate type is 'business-profile' or 'business'
    if (qrData.type !== 'business-profile' && qrData.type !== 'business') {
      return null
    }
    
    return qrData.data
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
