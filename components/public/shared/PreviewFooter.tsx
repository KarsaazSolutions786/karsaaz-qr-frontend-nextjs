import React from 'react';

interface PreviewFooterProps {
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
  showBranding?: boolean;
  customLinks?: Array<{ label: string; href: string }>;
  className?: string;
}

export default function PreviewFooter({
  showCTA = true,
  ctaText = 'Create Your QR Code',
  ctaLink = 'https://app.karsaazqr.com',
  showBranding = true,
  customLinks,
  className = '',
}: PreviewFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white border-t border-gray-200 py-8 mt-auto ${className}`}>
      <div className="container mx-auto px-4">
        {/* CTA Section */}
        {showCTA && (
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Create Your Own QR Code
            </h3>
            <p className="text-gray-600 mb-4">
              Advanced QR codes with dynamic content, analytics, and more
            </p>
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              {ctaText}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
        
        {/* Links Section */}
        {customLinks && customLinks.length > 0 && (
          <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
            {customLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
        
        {/* Branding Section */}
        {showBranding && (
          <div className="text-center border-t border-gray-200 pt-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/>
              </svg>
              <span className="font-semibold text-gray-900">Karsaaz QR</span>
            </div>
            <p className="text-xs text-gray-500">
              © {currentYear} Karsaaz QR. All rights reserved.
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
