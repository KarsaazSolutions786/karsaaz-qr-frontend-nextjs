import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import VCardPreview from '@/components/public/vcard/VCardPreview'

async function getVCard(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/qrcodes/vcard/${slug}`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
      return null
    }
    
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error('Failed to fetch vCard:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const vcard = await getVCard(params.slug)

  if (!vcard) {
    return {
      title: 'Contact Not Found',
      description: 'The requested contact card could not be found.',
    }
  }

  const fullName = [vcard.firstName, vcard.lastName].filter(Boolean).join(' ')
  const title = vcard.title ? `${fullName} - ${vcard.title}` : fullName

  return {
    title: `${title} - Contact Card`,
    description: vcard.bio || `Get in touch with ${fullName}. View contact information and save to your contacts.`,
    openGraph: {
      title: fullName,
      description: vcard.title || vcard.bio || `Contact information for ${fullName}`,
      images: vcard.photo ? [vcard.photo] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullName,
      description: vcard.title || vcard.bio || `Contact information for ${fullName}`,
      images: vcard.photo ? [vcard.photo] : [],
    },
  }
}

export default async function PublicVCardPage({ params }: { params: { slug: string } }) {
  const vcard = await getVCard(params.slug)

  if (!vcard) {
    notFound()
  }

  return <VCardPreview vcard={vcard} />
}
