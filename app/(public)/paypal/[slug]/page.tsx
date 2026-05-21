import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PayPalPreview from '@/components/public/paypal/PayPalPreview'
import { getQRCodeRedirect, trackQRView } from '@/lib/api/public-qrcodes'

const VALID_TYPES = ['paypal', 'payment-paypal']

/**
 * Purpose: Retrieves paypaldata.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
async function getPayPalData(slug: string) {
  try {
    const qrData = await getQRCodeRedirect(slug)

    if (!VALID_TYPES.includes(qrData.type)) {
      console.error(`Invalid QR type for PayPal page: ${qrData.type}`)
      return null
    }

    trackQRView(slug)

    return qrData.data
  } catch (error) {
    console.error('Failed to fetch PayPal data:', error)
    return null
  }
}

/**
 * Purpose: Executes generateMetadata functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getPayPalData(params.slug)

  if (!data) {
    return {
      title: 'Payment Not Found',
      description: 'The requested payment page could not be found.',
    }
  }

  const typeLabels: Record<string, string> = {
    _xclick: 'Payment',
    _donations: 'Donation',
    _cart: 'Cart',
  }

  const typeLabel = typeLabels[data.type] || 'Payment'
  const title = data.item_name
    ? `${typeLabel} - ${data.item_name}`
    : `PayPal ${typeLabel}`

  const description = data.amount
    ? `${typeLabel} of ${data.currency || 'USD'} ${data.amount} via PayPal`
    : `Complete your ${typeLabel.toLowerCase()} via PayPal`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    robots: {
      index: false,
      follow: false,
    },
  }
}

/**
 * Purpose: Executes PublicPayPalPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default async function PublicPayPalPage({ params }: { params: { slug: string } }) {
  const data = await getPayPalData(params.slug)

  if (!data) {
    notFound()
  }

  return <PayPalPreview data={data} />
}
