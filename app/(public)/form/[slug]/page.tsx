import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FormPreview from '@/components/public/lead-form/FormPreview'
import { getQRCodeRedirect } from '@/lib/api/public-qrcodes'

async function getLeadForm(slug: string) {
  try {
    const qrData = await getQRCodeRedirect(slug)
    
    // Validate type is 'lead-form', 'form', or 'contact-form'
    const validTypes = ['lead-form', 'form', 'contact-form']
    if (!validTypes.includes(qrData.type)) {
      return null
    }

    return qrData.data
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
