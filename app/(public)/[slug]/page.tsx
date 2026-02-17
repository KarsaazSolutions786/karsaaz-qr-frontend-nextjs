import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BiolinkPreview from '@/components/features/biolinks/editor/BiolinkPreview'

async function getBiolink(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/biolinks/slug/${slug}`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
      return null
    }
    
    const data = await res.json()
    return data.data
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
