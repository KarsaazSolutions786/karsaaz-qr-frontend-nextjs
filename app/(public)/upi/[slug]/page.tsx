import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import UPIPreview from '@/components/public/upi/UPIPreview'

async function getUPIPayment(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/qrcodes/upi-dynamic/${slug}`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
      return null
    }
    
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error('Failed to fetch UPI payment:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const upiData = await getUPIPayment(params.slug)

  if (!upiData) {
    return {
      title: 'Payment Not Found',
      description: 'The requested payment page could not be found.',
    }
  }

  const merchantName = upiData.merchantName || 'Merchant'
  const amount = upiData.amount ? `₹${upiData.amount}` : 'Custom Amount'

  return {
    title: `Pay ${merchantName} - ${amount}`,
    description: upiData.description || `Secure UPI payment to ${merchantName}. Pay instantly using any UPI app like PhonePe, Google Pay, Paytm, or BHIM.`,
    openGraph: {
      title: `Pay ${merchantName}`,
      description: `${amount} - Secure UPI Payment`,
      images: upiData.logo ? [upiData.logo] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Pay ${merchantName}`,
      description: `${amount} - Secure UPI Payment`,
      images: upiData.logo ? [upiData.logo] : [],
    },
  }
}

export default async function PublicUPIPaymentPage({ params }: { params: { slug: string } }) {
  const upiData = await getUPIPayment(params.slug)

  if (!upiData) {
    notFound()
  }

  return <UPIPreview upiData={upiData} />
}
