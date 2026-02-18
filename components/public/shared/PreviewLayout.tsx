import React from 'react';

interface PreviewLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  showHeader?: boolean;
  showFooter?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export default function PreviewLayout({
  children,
  title = 'QR Code Preview',
  description = 'View QR Code content',
  image,
  type = 'website',
  showHeader = true,
  showFooter = true,
  theme = 'auto',
  className = '',
}: PreviewLayoutProps) {
  return (
    <html lang="en" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={type} />
        {image && <meta property="og:image" content={image} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {image && <meta name="twitter:image" content={image} />}
        
        <title>{title}</title>
      </head>
      <body className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="flex flex-col min-h-screen">
          {showHeader && (
            <header className="bg-white border-b border-gray-200 py-4">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/>
                    </svg>
                    <span className="text-xl font-bold text-gray-900">Karsaaz QR</span>
                  </div>
                </div>
              </div>
            </header>
          )}
          
          <main className="flex-1">
            {children}
          </main>
          
          {showFooter && (
            <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
              <div className="container mx-auto px-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Create your own QR codes with advanced features
                  </p>
                  <a
                    href="https://app.karsaazqr.com"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Started Free
                  </a>
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <span>Powered by</span>
                    <strong className="text-blue-600">Karsaaz QR</strong>
                  </div>
                </div>
              </div>
            </footer>
          )}
        </div>
      </body>
    </html>
  );
}
