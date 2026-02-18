import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FormPreview from '@/components/public/lead-form/FormPreview'

async function getLeadForm(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/qrcodes/lead-form/${slug}`,
      {
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.data
  } catch (error) {
    console.error('Failed to fetch lead form:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const form = await getLeadForm(params.slug)

  if (!form) {
    return {
      title: 'Form Not Found',
      description: 'The requested form could not be found.',
    }
  }

  return {
    title: `${form.name} - Lead Form`,
    description: form.description || `Fill out this form to connect with us.`,
    openGraph: {
      title: form.name,
      description: form.description || `Submit your information through this form`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: form.name,
      description: form.description || `Submit your information through this form`,
    },
  }
}

export default async function PublicLeadFormPage({ params }: { params: { slug: string } }) {
  const form = await getLeadForm(params.slug)

  if (!form) {
    notFound()
  }

  return <FormPreview form={form} />
}
