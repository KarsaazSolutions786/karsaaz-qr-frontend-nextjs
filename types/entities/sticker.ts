/**
 * Sticker Configuration Types
 * 
 * Defines sticker options, positioning, and gallery management
 * for QR code decoration.
 */

// Sticker Categories
export type StickerCategory =
  | 'call-to-action'
  | 'social-media'
  | 'contact'
  | 'business'
  | 'events'
  | 'seasonal'
  | 'custom';

// Sticker Position Presets
export type StickerPositionPreset =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'custom';

// Sticker Configuration
export interface StickerPosition {
  preset: StickerPositionPreset;
  x?: number; // Custom X position (0-1, percentage)
  y?: number; // Custom Y position (0-1, percentage)
}

export interface StickerConfig {
  id: string; // Sticker ID
  url: string; // Sticker image URL
  position: StickerPosition;
  size: number; // 0-1 (percentage of QR code size, default: 0.2)
  rotation?: number; // 0-360 degrees
  opacity?: number; // 0-1
}

// Sticker Gallery Item
export interface Sticker {
  id: string;
  name: string;
  category: StickerCategory;
  url: string; // Image URL
  thumbnail?: string; // Thumbnail URL
  tags?: string[]; // Searchable tags
  isCustom: boolean; // User-uploaded vs built-in
  createdAt?: string; // For custom stickers
}

// Sticker Upload
export interface StickerUploadData {
  file: File;
  name: string;
  category?: StickerCategory;
  tags?: string[];
}

// Built-in Sticker Gallery
export const BUILTIN_STICKERS: Sticker[] = [
  {
    id: 'scan-me-1',
    name: 'Scan Me',
    category: 'call-to-action',
    url: '/stickers/scan-me-1.svg',
    tags: ['scan', 'cta'],
    isCustom: false,
  },
  {
    id: 'scan-me-2',
    name: 'Scan Here',
    category: 'call-to-action',
    url: '/stickers/scan-here.svg',
    tags: ['scan', 'cta', 'arrow'],
    isCustom: false,
  },
  {
    id: 'follow-us',
    name: 'Follow Us',
    category: 'social-media',
    url: '/stickers/follow-us.svg',
    tags: ['social', 'follow'],
    isCustom: false,
  },
  {
    id: 'visit-website',
    name: 'Visit Website',
    category: 'call-to-action',
    url: '/stickers/visit-website.svg',
    tags: ['website', 'cta'],
    isCustom: false,
  },
  {
    id: 'call-now',
    name: 'Call Now',
    category: 'contact',
    url: '/stickers/call-now.svg',
    tags: ['phone', 'contact', 'call'],
    isCustom: false,
  },
  {
    id: 'email-us',
    name: 'Email Us',
    category: 'contact',
    url: '/stickers/email-us.svg',
    tags: ['email', 'contact'],
    isCustom: false,
  },
  {
    id: 'order-now',
    name: 'Order Now',
    category: 'business',
    url: '/stickers/order-now.svg',
    tags: ['order', 'business', 'cta'],
    isCustom: false,
  },
  {
    id: 'menu',
    name: 'View Menu',
    category: 'business',
    url: '/stickers/menu.svg',
    tags: ['menu', 'restaurant', 'business'],
    isCustom: false,
  },
  {
    id: 'wifi',
    name: 'Free WiFi',
    category: 'business',
    url: '/stickers/wifi.svg',
    tags: ['wifi', 'internet'],
    isCustom: false,
  },
  {
    id: 'download-app',
    name: 'Download App',
    category: 'call-to-action',
    url: '/stickers/download-app.svg',
    tags: ['app', 'download', 'mobile'],
    isCustom: false,
  },
  {
    id: 'get-coupon',
    name: 'Get Coupon',
    category: 'business',
    url: '/stickers/get-coupon.svg',
    tags: ['coupon', 'discount', 'offer'],
    isCustom: false,
  },
  {
    id: 'register',
    name: 'Register Now',
    category: 'events',
    url: '/stickers/register.svg',
    tags: ['register', 'event', 'signup'],
    isCustom: false,
  },
];

// Default sticker position presets
export const POSITION_PRESETS: Record<StickerPositionPreset, { x: number; y: number }> = {
  top: { x: 0.5, y: 0 },
  bottom: { x: 0.5, y: 1 },
  left: { x: 0, y: 0.5 },
  right: { x: 1, y: 0.5 },
  'top-left': { x: 0, y: 0 },
  'top-right': { x: 1, y: 0 },
  'bottom-left': { x: 0, y: 1 },
  'bottom-right': { x: 1, y: 1 },
  custom: { x: 0.5, y: 1 }, // Default to bottom center
};

// Helper function to get position coordinates
export function getStickerPosition(position: StickerPosition): { x: number; y: number } {
  if (position.preset === 'custom' && position.x !== undefined && position.y !== undefined) {
    return { x: position.x, y: position.y };
  }
  return POSITION_PRESETS[position.preset];
}
