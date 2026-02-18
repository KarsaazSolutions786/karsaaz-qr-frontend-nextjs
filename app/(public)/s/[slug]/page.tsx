import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getQRCodeRedirect } from '@/lib/api/public-qrcodes';

interface QRRouteData {
  id: string;
  slug: string;
  type: string;
  data: any;
  design?: any;
  name?: string;
  description?: string;
  redirect?: {
    route: string;
    slug: string;
  };
}

async function fetchQRData(slug: string): Promise<QRRouteData | null> {
  try {
    // The backend uses /qrcodes/{id}/redirect but we're calling with slug
    // The backend should handle slug lookup internally
    const data = await getQRCodeRedirect(slug);
    return data;
  } catch (error) {
    console.error('Error fetching QR data:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const qrData = await fetchQRData(params.slug);

  if (!qrData) {
    return {
      title: 'QR Code Not Found',
    };
  }

  return {
    title: qrData.name || `${qrData.type} QR Code`,
    description: qrData.description || 'View QR code content',
    openGraph: {
      title: qrData.name || `${qrData.type} QR Code`,
      description: qrData.description || 'View QR code content',
    },
    twitter: {
      card: 'summary_large_image',
      title: qrData.name || `${qrData.type} QR Code`,
      description: qrData.description || 'View QR code content',
    },
  };
}

export default async function UniversalQRPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { preview?: string };
}) {
  const qrData = await fetchQRData(params.slug);

  if (!qrData) {
    notFound();
  }

  // Handle preview mode
  const isPreview = searchParams?.preview === 'true';
  const previewParam = isPreview ? '?preview=true' : '';

  // Get the actual slug from the response (may be different from URL param)
  const actualSlug = qrData.redirect?.slug || qrData.slug || params.slug;

  // Route to appropriate preview page based on QR type
  const typeRoutes: Record<string, string> = {
    biolinks: `/${actualSlug}`,
    biolink: `/${actualSlug}`,
    'business-profile': `/business-profile/${actualSlug}`,
    business: `/business-profile/${actualSlug}`,
    'vcard-plus': `/vcard/${actualSlug}`,
    vcard: `/vcard/${actualSlug}`,
    contact: `/vcard/${actualSlug}`,
    'restaurant-menu': `/menu/${actualSlug}`,
    menu: `/menu/${actualSlug}`,
    'product-catalogue': `/products/${actualSlug}`,
    products: `/products/${actualSlug}`,
    catalog: `/products/${actualSlug}`,
    catalogue: `/products/${actualSlug}`,
    'business-review': `/review/${actualSlug}`,
    review: `/review/${actualSlug}`,
    rating: `/review/${actualSlug}`,
    event: `/event/${actualSlug}`,
    'lead-form': `/form/${actualSlug}`,
    form: `/form/${actualSlug}`,
    'contact-form': `/form/${actualSlug}`,
    'website-builder': `/website/${actualSlug}`,
    website: `/website/${actualSlug}`,
    site: `/website/${actualSlug}`,
    resume: `/resume/${actualSlug}`,
    cv: `/resume/${actualSlug}`,
    'curriculum-vitae': `/resume/${actualSlug}`,
    'upi-dynamic': `/upi/${actualSlug}`,
    upi: `/upi/${actualSlug}`,
    payment: `/upi/${actualSlug}`,
    'app-download': `/app/${actualSlug}`,
    app: `/app/${actualSlug}`,
    download: `/app/${actualSlug}`,
  };

  // Get the redirect path for this QR type
  const redirectPath = typeRoutes[qrData.type.toLowerCase()];

  if (redirectPath) {
    // Redirect to type-specific page
    redirect(redirectPath + previewParam);
  }

  // For static QR types (URL, Email, Phone, etc.), redirect directly
  if (qrData.redirect?.route) {
    redirect(qrData.redirect.route);
  }

  // If data has a direct URL, redirect to it
  if (qrData.data?.url) {
    redirect(qrData.data.url);
  }

  // Fallback if no route found
  notFound();
}
