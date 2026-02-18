'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { hasLandingPage } from '@/lib/utils/qr-preview-router';

// Dynamically import preview components
const BusinessProfilePreview = dynamic(
  () => import('@/components/public/business-profile/BusinessProfilePreview')
);
const VCardPreview = dynamic(
  () => import('@/components/public/vcard/VCardPreview')
);
const MenuPreview = dynamic(
  () => import('@/components/public/restaurant-menu/MenuPreview')
);
const CataloguePreview = dynamic(
  () => import('@/components/public/product-catalogue/CataloguePreview')
);
const ReviewPreview = dynamic(
  () => import('@/components/public/business-review/ReviewPreview')
);
const EventPreview = dynamic(
  () => import('@/components/public/event/EventPreview')
);
const FormPreview = dynamic(
  () => import('@/components/public/lead-form/FormPreview')
);
const WebsitePreview = dynamic(
  () => import('@/components/public/website-builder/WebsitePreview')
);
const ResumePreview = dynamic(
  () => import('@/components/public/resume/ResumePreview')
);
const UPIPreview = dynamic(
  () => import('@/components/public/upi/UPIPreview')
);
const AppPreview = dynamic(
  () => import('@/components/public/app-download/AppPreview')
);
const BiolinkPreview = dynamic(
  () => import('@/components/features/biolinks/editor/BiolinkPreview')
);

interface QRTypeRendererProps {
  qrType: string;
  data: any;
  slug: string;
}

export default function QRTypeRenderer({ qrType, data }: QRTypeRendererProps) {
  const normalizedType = qrType.toLowerCase().trim();

  // Check if type has a landing page
  if (!hasLandingPage(normalizedType)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Unsupported QR Type
          </h1>
          <p className="text-gray-600">
            This QR code type ({qrType}) does not have a landing page.
          </p>
        </div>
      </div>
    );
  }

  // Render appropriate preview component based on type
  const renderPreview = () => {
    switch (normalizedType) {
      case 'biolinks':
      case 'biolink':
        return <BiolinkPreview biolink={data} blocks={data?.blocks || []} />;
      
      case 'business-profile':
      case 'business':
        return <BusinessProfilePreview profile={data} />;
      
      case 'vcard-plus':
      case 'vcard':
      case 'contact':
        return <VCardPreview vcard={data} />;
      
      case 'restaurant-menu':
      case 'menu':
        return <MenuPreview menu={data} />;
      
      case 'product-catalogue':
      case 'products':
      case 'catalog':
      case 'catalogue':
        return <CataloguePreview data={data} />;
      
      case 'business-review':
      case 'review':
      case 'rating':
        return <ReviewPreview review={data} />;
      
      case 'event':
        return <EventPreview event={data} />;
      
      case 'lead-form':
      case 'form':
      case 'contact-form':
        return <FormPreview form={data} />;
      
      case 'website-builder':
      case 'website':
      case 'site':
        return <WebsitePreview website={data} />;
      
      case 'resume':
      case 'cv':
      case 'curriculum-vitae':
        return <ResumePreview data={data} />;
      
      case 'upi-dynamic':
      case 'upi':
      case 'payment':
        return <UPIPreview upiData={data} />;
      
      case 'app-download':
      case 'app':
      case 'download':
        return <AppPreview app={data} />;
      
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Unknown QR Type
              </h1>
              <p className="text-gray-600">Type: {qrType}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading QR code content...</p>
          </div>
        </div>
      }
    >
      {renderPreview()}
    </Suspense>
  );
}
