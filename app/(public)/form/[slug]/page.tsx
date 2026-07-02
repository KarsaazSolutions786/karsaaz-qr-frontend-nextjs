import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FormPreview from '@/components/public/lead-form/FormPreview'
import { getQRCodeRedirect } from '@/lib/api/public-qrcodes'

/**
 * Purpose: Retrieves leadform.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
async function getLeadForm(slug: string) {
  try {
    const qrData = await getQRCodeRedirect(slug)

    // Validate type is 'lead-form', 'form', or 'contact-form'
    const validTypes = ['lead-form', 'form', 'contact-form']
    if (!validTypes.includes(qrData.type)) {
      return null
    }

    const data = qrData.data as Record<string, unknown>
    if (!data?.fields || !Array.isArray(data.fields)) {
      return null
    }

    const rawSettings = (data.settings as Record<string, any>) || {}
    const settings = {
      submitButtonText: String(rawSettings.submitButtonText ?? 'Submit'),
      successMessage: String(rawSettings.successMessage ?? 'Thank you!'),
      redirectUrl: rawSettings.redirectUrl ? String(rawSettings.redirectUrl) : undefined,
      sendEmail: Boolean(rawSettings.sendEmail ?? false),
      emailRecipients: Array.isArray(rawSettings.emailRecipients)
        ? rawSettings.emailRecipients.map(String)
        : undefined,
      allowDuplicates: Boolean(rawSettings.allowDuplicates ?? true),
      captchaEnabled: Boolean(rawSettings.captchaEnabled ?? false),
    }

    return {
      id: Number(data.lead_form_id ?? 0),
      name: String(data.name ?? data.form_name ?? 'Lead Form'),
      description: (data.description as string | null) ?? null,
      slug: slug,
      fields: data.fields,
      settings: settings,
      isActive: true,
      responseCount: 0,
      userId: 0,
      createdAt: '',
      updatedAt: '',
    }
  } catch (error) {
    console.error('Failed to fetch lead form:', error)
    return null
  }
}

/**
 * Purpose: Executes generateMetadata functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
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

/**
 * Purpose: Executes PublicLeadFormPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default async function PublicLeadFormPage({ params }: { params: { slug: string } }) {
  const form = await getLeadForm(params.slug)

  if (!form) {
    notFound()
  }

  return <FormPreview form={form} />
}
