import { notFound } from 'next/navigation';
import CataloguePreview from '@/components/public/product-catalogue/CataloguePreview';
import { getQRCodeRedirect, trackQRView } from '@/lib/api/public-qrcodes';

interface ProductCataloguePageProps {
  params: {
    slug: string;
  };
}

const VALID_CATALOGUE_TYPES = ['product-catalogue', 'products', 'catalog', 'catalogue'];

async function getCatalogueData(slug: string) {
  try {
    const qrData = await getQRCodeRedirect(slug);
    
    // Validate type
    if (!VALID_CATALOGUE_TYPES.includes(qrData.type)) {
      console.error(`Invalid QR code type: ${qrData.type}. Expected one of: ${VALID_CATALOGUE_TYPES.join(', ')}`);
      return null;
    }

    // Track view for analytics
    trackQRView(slug);
    
    return qrData.data;
  } catch (error) {
    console.error('Error fetching catalogue:', error);
    return null;
  }
}

export default async function ProductCataloguePage({ params }: ProductCataloguePageProps) {
  const data = await getCatalogueData(params.slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CataloguePreview data={data} />
    </div>
  );
}

export async function generateMetadata({ params }: ProductCataloguePageProps) {
  const data = await getCatalogueData(params.slug);

  if (!data) {
    return {
      title: 'Product Catalogue Not Found',
    };
  }

  return {
    title: `${data.storeName || 'Product Catalogue'} - Shop Now`,
    description: data.storeDescription || 'Browse our product catalogue',
  };
}
