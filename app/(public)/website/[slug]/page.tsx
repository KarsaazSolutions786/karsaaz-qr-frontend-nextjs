import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import WebsitePreview from '@/components/public/website-builder/WebsitePreview'
import { getQRCodeRedirect } from '@/lib/api/public-qrcodes'

async function getWebsite(slug: string) {
  try {
    const qrData = await getQRCodeRedirect(slug)
    
    if (!qrData || !qrData.data) {
      return null
    }
    
    // Validate type is 'website-builder', 'website', or 'site'
    if (!['website-builder', 'website', 'site'].includes(qrData.data.type)) {
      return null
    }
    
    return qrData.data
  } catch (error) {
    console.error('Failed to fetch website:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const website = await getWebsite(params.slug)

  if (!website) {
    return {
      title: 'Website Not Found',
      description: 'The requested website could not be found.',
    }
  }

  return {
    title: website.title || 'Custom Website',
    description: website.description || 'View this custom-built website',
    openGraph: {
      title: website.title || 'Custom Website',
      description: website.description || 'View this custom-built website',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: website.title || 'Custom Website',
      description: website.description || 'View this custom-built website',
    },
  }
}

export default async function WebsitePage({ params }: { params: { slug: string } }) {
  const website = await getWebsite(params.slug)

  if (!website) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <WebsitePreview website={website} />
    </div>
  )
}
