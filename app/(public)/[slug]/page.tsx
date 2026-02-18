import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BiolinkPreview from '@/components/features/biolinks/editor/BiolinkPreview'
import { getQRCodeRedirect, trackQRView } from '@/lib/api/public-qrcodes'

async function getBiolink(slug: string) {
  try {
    // Use the public API to get QR code data
    const qrData = await getQRCodeRedirect(slug)
    
    // Validate it's a biolinks type
    if (!['biolinks', 'biolink'].includes(qrData.type?.toLowerCase())) {
      return null
    }
    
    // Track the view (fire-and-forget analytics)
    trackQRView(slug)
    
    // Return the biolinks data
    return qrData.data
  } catch (error) {
    console.error('Failed to fetch biolink:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const biolink = await getBiolink(params.slug)

  if (!biolink) {
    return {
      title: 'Not Found',
    }
  }

  return {
    title: biolink.title,
    description: biolink.description || `Visit ${biolink.title}'s biolink page`,
  }
}

export default async function PublicBiolinkPage({ params }: { params: { slug: string } }) {
  const biolink = await getBiolink(params.slug)

  if (!biolink || !biolink.isPublished) {
    notFound()
  }

  return <BiolinkPreview biolink={biolink} blocks={biolink.blocks} />
}
