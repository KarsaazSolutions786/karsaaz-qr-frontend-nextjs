import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import WebsitePreview from '@/components/public/website-builder/WebsitePreview'

async function getWebsite(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/qrcodes/website-builder/${slug}`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
      return null
    }
    
    const data = await res.json()
    return data.data
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
