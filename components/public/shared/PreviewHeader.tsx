import React from 'react';

interface PreviewHeaderProps {
  title?: string;
  subtitle?: string;
  logo?: string;
  showBranding?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export default function PreviewHeader({
  title,
  subtitle,
  logo,
  showBranding = true,
  actions,
  className = '',
}: PreviewHeaderProps) {
  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo/Title */}
          <div className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
            ) : showBranding ? (
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/>
                </svg>
                <span className="text-lg font-bold text-gray-900">Karsaaz QR</span>
              </div>
            ) : null}
            
            {title && (
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600">{subtitle}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Right: Actions */}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
