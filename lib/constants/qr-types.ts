/**
 * QR Code Type Definitions
 *
 * Centralized source of truth for all QR code types.
 * Mirrors the original Lit Element project's qr-types.js with all 43 types,
 * categories, and icon mappings.
 */

export interface QRCodeTypeDefinition {
  id: string
  name: string
  cat: 'static' | 'dynamic'
  icon: string // Path to icon in /public/icons/qr-types/
  description?: string
}

/**
 * Social media types that use a smaller icon-only card layout
 * in the bento grid (no text label, just the icon).
 */
export const SOCIAL_MEDIA_TYPES: Record<string, boolean> = {
  facebook: true,
  instagram: true,
  linkedin: true,
  youtube: true,
  telegram: true,
  whatsapp: true,
  facebookmessenger: true,
  viber: true,
  call: true,
}

/**
 * Full list of all QR code types in display order.
 * Order matters — the first 16 are shown in the bento grid layout.
 */
export const QR_TYPES: QRCodeTypeDefinition[] = [
  {
    id: 'text',
    name: 'URL / Link',
    cat: 'static',
    icon: '/icons/qr-types/url.png',
    description: 'Link to any website or URL',
  },
  {
    id: 'url',
    name: 'Dynamic URL',
    cat: 'dynamic',
    icon: '/icons/qr-types/dynamicURL.png',
    description: 'Editable URL after printing',
  },
  {
    id: 'business-profile',
    name: 'Business Profile',
    cat: 'dynamic',
    icon: '/icons/qr-types/businessProfile.png',
    description: 'Complete business information',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    cat: 'dynamic',
    icon: '/icons/qr-types/logos_whatsapp-icon.svg',
    description: 'Start WhatsApp conversation',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    cat: 'static',
    icon: '/icons/qr-types/logos_telegram.svg',
    description: 'Open Telegram chat',
  },
  {
    id: 'email',
    name: 'Email (Static)',
    cat: 'static',
    icon: '/icons/qr-types/email.png',
    description: 'Pre-filled email',
  },
  {
    id: 'call',
    name: 'Call',
    cat: 'static',
    icon: '/icons/qr-types/phone.png',
    description: 'Direct phone call',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    cat: 'static',
    icon: '/icons/qr-types/instagram.svg',
    description: 'Open Instagram profile',
  },
  {
    id: 'vcard',
    name: 'VCard',
    cat: 'static',
    icon: '/icons/qr-types/vcard.png',
    description: 'Share contact card',
  },
  {
    id: 'restaurant-menu',
    name: 'Restaurant Menu',
    cat: 'dynamic',
    icon: '/icons/qr-types/restaurant.png',
    description: 'Digital restaurant menu',
  },
  {
    id: 'vcard-plus',
    name: 'vCard Plus',
    cat: 'dynamic',
    icon: '/icons/qr-types/vcardPlus.png',
    description: 'Enhanced digital business card',
  },
  {
    id: 'youtube',
    name: 'Youtube',
    cat: 'static',
    icon: '/icons/qr-types/logos_youtube-icon.svg',
    description: 'Link to YouTube video',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    cat: 'static',
    icon: '/icons/qr-types/logos_facebook.svg',
    description: 'Open Facebook page',
  },
  {
    id: 'product-catalogue',
    name: 'Product Catalogue',
    cat: 'dynamic',
    icon: '/icons/qr-types/product.png',
    description: 'Showcase your products',
  },
  {
    id: 'facebookmessenger',
    name: 'Messenger',
    cat: 'static',
    icon: '/icons/qr-types/FACEBOOK_MESSENGER.svg',
    description: 'Open Messenger chat',
  },
  {
    id: 'linkedin',
    name: 'Linkedin',
    cat: 'static',
    icon: '/icons/qr-types/logos_linkedin-icon.svg',
    description: 'Open LinkedIn profile',
  },
  {
    id: 'biolinks',
    name: 'Bio Links (List of Links)',
    cat: 'dynamic',
    icon: '/icons/qr-types/bioLinks.png',
    description: 'Multiple links in one page',
  },
  {
    id: 'business-review',
    name: 'Business Review',
    cat: 'dynamic',
    icon: '/icons/qr-types/businessReview.png',
    description: 'Collect business reviews',
  },
  {
    id: 'website-builder',
    name: 'Website Builder',
    cat: 'dynamic',
    icon: '/icons/qr-types/websitebuilder.png',
    description: 'Create a mini website',
  },
  {
    id: 'lead-form',
    name: 'Lead Form',
    cat: 'dynamic',
    icon: '/icons/qr-types/leadForm.png',
    description: 'Collect leads and contacts',
  },
  {
    id: 'app-download',
    name: 'App Download',
    cat: 'dynamic',
    icon: '/icons/qr-types/appDownload.png',
    description: 'Link to app stores',
  },
  {
    id: 'google-review',
    name: 'Google Review',
    cat: 'dynamic',
    icon: '/icons/qr-types/googleReview.png',
    description: 'Get Google reviews',
  },
  {
    id: 'resume',
    name: 'Resume QR Code',
    cat: 'dynamic',
    icon: '/icons/qr-types/resumeQrCode.png',
    description: 'Digital resume / CV',
  },
  {
    id: 'file-upload',
    name: 'File Upload',
    cat: 'dynamic',
    icon: '/icons/qr-types/fileUpload.png',
    description: 'Share downloadable files',
  },
  {
    id: 'event',
    name: 'Event',
    cat: 'dynamic',
    icon: '/icons/qr-types/event.png',
    description: 'Event details and RSVP',
  },
  {
    id: 'email-dynamic',
    name: 'Email (Dynamic)',
    cat: 'dynamic',
    icon: '/icons/qr-types/dynamicEmail.png',
    description: 'Editable email link',
  },
  {
    id: 'sms',
    name: 'SMS (Static)',
    cat: 'static',
    icon: '/icons/qr-types/sms.png',
    description: 'Pre-filled text message',
  },
  {
    id: 'sms-dynamic',
    name: 'SMS (Dynamic)',
    cat: 'dynamic',
    icon: '/icons/qr-types/sms.png',
    description: 'Editable SMS link',
  },
  {
    id: 'wifi',
    name: 'WIFI',
    cat: 'static',
    icon: '/icons/qr-types/wifi.png',
    description: 'WiFi network credentials',
  },
  {
    id: 'facetime',
    name: 'FaceTime',
    cat: 'static',
    icon: '/icons/qr-types/faceTime.png',
    description: 'Start FaceTime call',
  },
  {
    id: 'location',
    name: 'Location',
    cat: 'static',
    icon: '/icons/qr-types/location.png',
    description: 'GPS coordinates',
  },
  {
    id: 'crypto',
    name: 'Crypto',
    cat: 'static',
    icon: '/icons/qr-types/crypto.png',
    description: 'Cryptocurrency payment',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    cat: 'dynamic',
    icon: '/icons/qr-types/paypal.png',
    description: 'PayPal payment link',
  },
  {
    id: 'upi',
    name: 'UPI (Static)',
    cat: 'static',
    icon: '/icons/qr-types/UPI.png',
    description: 'UPI payment',
  },
  {
    id: 'upi-dynamic',
    name: 'UPI (Dynamic)',
    cat: 'dynamic',
    icon: '/icons/qr-types/UPI.png',
    description: 'Editable UPI payment',
  },
  {
    id: 'zoom',
    name: 'Zoom',
    cat: 'static',
    icon: '/icons/qr-types/zoom.png',
    description: 'Zoom meeting link',
  },
  {
    id: 'brazilpix',
    name: 'Brazillian PIX',
    cat: 'static',
    icon: '/icons/qr-types/brazillian.png',
    description: 'PIX payment',
  },
  {
    id: 'viber',
    name: 'Viber Chat',
    cat: 'static',
    icon: '/icons/qr-types/viberchat.png',
    description: 'Start Viber conversation',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    cat: 'static',
    icon: '/icons/qr-types/twitter.png',
    description: 'Open X/Twitter profile',
  },
  {
    id: 'googlemaps',
    name: 'Google Maps',
    cat: 'static',
    icon: '/icons/qr-types/googleMap.png',
    description: 'Open in Google Maps',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    cat: 'static',
    icon: '/icons/qr-types/snapChat.png',
    description: 'Open Snapchat profile',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    cat: 'static',
    icon: '/icons/qr-types/spotify.png',
    description: 'Spotify track or playlist',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    cat: 'static',
    icon: '/icons/qr-types/tiktok.png',
    description: 'TikTok profile link',
  },
]

/**
 * Get available QR code types, optionally filtered by category.
 */
export function getAvailableQrCodeTypes(
  category?: 'all' | 'static' | 'dynamic'
): QRCodeTypeDefinition[] {
  if (!category || category === 'all') return QR_TYPES
  return QR_TYPES.filter((t) => t.cat === category)
}

/**
 * Find a QR code type definition by its slug/id.
 */
export function findQrCodeType(
  slug: string
): QRCodeTypeDefinition | undefined {
  return QR_TYPES.find((t) => t.id === slug)
}

/**
 * Check if a QR code type is dynamic.
 */
export function isQrCodeTypeDynamic(slug: string): boolean {
  const type = findQrCodeType(slug)
  return type?.cat === 'dynamic'
}

/**
 * Check if a type ID corresponds to a social media type
 * that should render as an icon-only card.
 */
export function isSocialMediaType(typeId: string): boolean {
  return !!SOCIAL_MEDIA_TYPES[typeId]
}
