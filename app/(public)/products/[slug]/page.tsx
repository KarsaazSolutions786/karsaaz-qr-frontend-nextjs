import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CataloguePreview from '@/components/public/product-catalogue/CataloguePreview'
import { getQRCodeRedirect, trackQRView } from '@/lib/api/public-qrcodes'

interface ProductCataloguePageProps {
  params: {
    slug: string
  }
}

const VALID_CATALOGUE_TYPES = ['product-catalogue', 'products', 'catalog', 'catalogue']

async function getCatalogueData(slug: string) {
  try {
    const qrData = await getQRCodeRedirect(slug)

    if (!VALID_CATALOGUE_TYPES.includes(qrData.type)) {
      console.error(
        `Invalid QR code type: ${qrData.type}. Expected one of: ${VALID_CATALOGUE_TYPES.join(', ')}`
      )
      return null
    }

    trackQRView(slug)

    return qrData.data
  } catch (error) {
    console.error('Error fetching catalogue:', error)
    return null
  }
}

export async function generateMetadata({ params }: ProductCataloguePageProps): Promise<Metadata> {
  const data = await getCatalogueData(params.slug)

  if (!data) {
    return {
      title: 'Product Catalogue Not Found',
    }
  }

  const storeName = data.storeName || data.business_name || 'Product Catalogue'
  const description =
    data.storeDescription || data.description || 'Browse our product catalogue'

  return {
    title: `${storeName} - Shop Now`,
    description,
    openGraph: {
      title: `${storeName} - Shop Now`,
      description,
      images: data.logo ? [data.logo] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${storeName} - Shop Now`,
      description,
      images: data.logo ? [data.logo] : [],
    },
  }
}

export default async function ProductCataloguePage({ params }: ProductCataloguePageProps) {
  const data = await getCatalogueData(params.slug)

  if (!data) {
    notFound()
  }

  // Normalize data shape for the preview component
  const normalizedData = {
    storeName: data.storeName || data.business_name || 'Products',
    storeDescription: data.storeDescription || data.description || '',
    logo: data.logo || '',
    contactEmail: data.contactEmail || data.email || '',
    contactPhone: data.contactPhone || data.phone || '',
    contactAddress: data.contactAddress || data.address || '',
    products: data.products || data.menuItems || [],
    categories: data.categories
      ? data.categories.map((c: any) => (typeof c === 'string' ? c : c.name))
      : [],
    allowCart: data.allowCart ?? false,
    allowInquiry: data.allowInquiry ?? true,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CataloguePreview data={normalizedData} />
    </div>
  )
}
