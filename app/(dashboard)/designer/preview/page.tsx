/**
 * Full-screen designer preview route
 */

'use client';

import React, { Suspense } from 'react';
import { toast } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download, Printer, X } from 'lucide-react';

function PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const src = searchParams.get('src');

  const handleClose = () => {
    router.back();
  };

  const handleDownload = async () => {
    if (!src) return;

    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      // Determine file extension from content type
      const contentType = response.headers.get('content-type');
      const extension = contentType?.includes('svg') ? 'svg' : 'png';
      link.download = `qrcode.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      toast.error('Download failed. Please try again.');
    }
  };

  const handlePrint = () => {
    if (!src) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.warning('Please allow popups in your browser to print the QR code.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              padding: 20px;
              background: white;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
            }
            @media print {
              body {
                padding: 0;
              }
              @page {
                margin: 0.5in;
              }
            }
          </style>
        </head>
        <body>
          <img src="${src}" alt="QR Code" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!src) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No QR code source provided
          </p>
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              QR Code Preview
            </h1>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                aria-label="Print QR code"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Download QR code"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
              
              <button
                onClick={handleClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
            <img
              src={src}
              alt="QR Code"
              className="w-full h-auto max-w-2xl mx-auto"
              style={{ imageRendering: 'crisp-edges' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading preview...</p>
          </div>
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
