'use client';

import React, { useEffect, useState } from 'react';
import { trackQRView } from '@/lib/api/public-qrcodes';

interface QRPreviewContainerProps {
  slug: string;
  children: React.ReactNode;
  onDataLoad?: (data: any) => void;
  onError?: (error: Error) => void;
}

export default function QRPreviewContainer({
  slug,
  children,
  onDataLoad: _onDataLoad,
  onError: _onError,
}: QRPreviewContainerProps) {
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    // Check if in preview mode
    const params = new URLSearchParams(window.location.search);
    setIsPreview(params.get('preview') === 'true');

    // Track page view (analytics) - only in non-preview mode
    if (typeof window !== 'undefined' && !isPreview) {
      trackQRView(slug);
    }
  }, [slug, isPreview]);

  return (
    <div className="qr-preview-container" data-preview={isPreview}>
      {isPreview && (
        <div className="bg-yellow-50 border-b border-yellow-200 py-2 px-4 text-center text-sm text-yellow-800">
          <strong>Preview Mode</strong> - This is how your QR code will appear to visitors
        </div>
      )}
      {children}
    </div>
  );
}
