import { notFound } from 'next/navigation';
import CataloguePreview from '@/components/public/product-catalogue/CataloguePreview';

interface ProductCataloguePageProps {
  params: {
    slug: string;
  };
}

async function getCatalogueData(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/qrcodes/product-catalogue/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
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
