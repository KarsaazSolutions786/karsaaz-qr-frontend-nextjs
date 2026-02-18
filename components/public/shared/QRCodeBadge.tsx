interface QRCodeBadgeProps {
  variant?: 'default' | 'minimal' | 'branded';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left';
  showLogo?: boolean;
  text?: string;
  link?: string;
  className?: string;
}

export default function QRCodeBadge({
  variant = 'default',
  position = 'bottom-right',
  showLogo = true,
  text = 'Powered by Karsaaz QR',
  link = 'https://app.karsaazqr.com',
  className = '',
}: QRCodeBadgeProps) {
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const variantClasses = {
    default: 'bg-white text-gray-700 border border-gray-200 shadow-md',
    minimal: 'bg-gray-900/80 text-white backdrop-blur-sm',
    branded: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg',
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed ${positionClasses[position]} 
        ${variantClasses[variant]} 
        ${className}
        px-3 py-2 rounded-full
        flex items-center gap-2
        text-xs font-medium
        hover:scale-105 transition-transform
        z-10
      `}
    >
      {showLogo && (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/>
        </svg>
      )}
      <span>{text}</span>
    </a>
  );
}
