/**
 * QR Shape Constants — matches legacy frontend exactly
 * 
 * Module shapes, finder styles, finder dot styles, outlined shapes, and advanced shapes
 */

import { ModuleShape, FinderStyle, FinderDotStyle } from '@/types/entities/designer'

// ============================================================
// Module Shapes (15) — matches legacy module-fields.js
// ============================================================
export const MODULE_SHAPES: { value: ModuleShape; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dots', label: 'Dots' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'rhombus', label: 'Rhombus' },
  { value: 'star-5', label: 'Star 5' },
  { value: 'star-7', label: 'Star 7' },
  { value: 'roundness', label: 'Rounded' },
  { value: 'vertical-lines', label: 'V-Lines' },
  { value: 'horizontal-lines', label: 'H-Lines' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'fish', label: 'Fish' },
  { value: 'tree', label: 'Tree' },
  { value: 'twoTrianglesWithCircle', label: '2-Tri Circle' },
  { value: 'fourTriangles', label: '4-Triangles' },
  { value: 'triangle-end', label: 'Tri-End' },
]

// ============================================================
// Finder Frame Styles (9) — matches legacy module-fields.js
// ============================================================
export const FINDER_STYLES: { value: FinderStyle; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'eye-shaped', label: 'Eye Shaped' },
  { value: 'octagon', label: 'Octagon' },
  { value: 'rounded-corners', label: 'Rounded' },
  { value: 'whirlpool', label: 'Whirlpool' },
  { value: 'water-drop', label: 'Water Drop' },
  { value: 'circle', label: 'Circle' },
  { value: 'zigzag', label: 'Zigzag' },
  { value: 'circle-dots', label: 'Circle Dots' },
]

// ============================================================
// Finder Dot Styles (8) — matches legacy module-fields.js
// ============================================================
export const FINDER_DOT_STYLES: { value: FinderDotStyle; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'eye-shaped', label: 'Eye Shaped' },
  { value: 'octagon', label: 'Octagon' },
  { value: 'rounded-corners', label: 'Rounded' },
  { value: 'whirlpool', label: 'Whirlpool' },
  { value: 'water-drop', label: 'Water Drop' },
  { value: 'circle', label: 'Circle' },
  { value: 'zigzag', label: 'Zigzag' },
]

// ============================================================
// Outlined Shapes (60+) — matches legacy qr-shapes.js
// ============================================================
export interface OutlinedShape {
  value: string
  label: string
}

export const OUTLINED_SHAPES: OutlinedShape[] = [
  { value: 'none', label: 'None' },
  { value: 'circle', label: 'Circle' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'shopping-cart', label: 'Shopping Cart' },
  { value: 'gift', label: 'Gift' },
  { value: 'cup', label: 'Cup' },
  { value: 't-shirt', label: 'T-Shirt' },
  { value: 'home', label: 'Home' },
  { value: 'book', label: 'Book' },
  { value: 'message', label: 'Message' },
  { value: 'bag', label: 'Bag' },
  { value: 'truck', label: 'Truck' },
  { value: 'trophy', label: 'Trophy' },
  { value: 'umbrella', label: 'Umbrella' },
  { value: 'van', label: 'Van' },
  { value: 'watch', label: 'Watch' },
  { value: 'water', label: 'Water' },
  { value: 'bulb', label: 'Bulb' },
  { value: 'sun', label: 'Sun' },
  { value: 'car', label: 'Car' },
  { value: 'pet', label: 'Pet' },
  { value: 'gym', label: 'GYM' },
  { value: 'salon', label: 'Salon' },
  { value: 'food', label: 'Food' },
  { value: 'ice-cream', label: 'Ice Cream' },
  { value: 'search', label: 'Search' },
  { value: 'burger', label: 'Burger' },
  { value: 'apple', label: 'Apple' },
  { value: 'barn', label: 'Barn' },
  { value: 'sun-rise', label: 'Sunrise' },
  { value: 'star', label: 'Star' },
  { value: 'realtor', label: 'Realtor' },
  { value: 'legal', label: 'Legal' },
  { value: 'juice', label: 'Juice' },
  { value: 'water-glass', label: 'Water Glass' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'builder', label: 'Builder' },
  { value: 'home-mover', label: 'Home Mover' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'travel', label: 'Travel' },
  { value: 'dentist', label: 'Dentist' },
  { value: 'golf', label: 'Golf' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'locksmith', label: 'Locksmith' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'painter', label: 'Painter' },
  { value: 'pest', label: 'Pest' },
  { value: 'teddy', label: 'Teddy' },
  { value: 'boot', label: 'Boot' },
  { value: 'shield', label: 'Shield' },
  { value: 'shawarma', label: 'Shawarma' },
  { value: 'ticket', label: 'Ticket' },
  { value: 'piggy-bank', label: 'Piggy Bank' },
  { value: 'realtor-sign', label: 'Realtor Sign' },
  { value: 'brain', label: 'Brain' },
]

// ============================================================
// Advanced Shapes / Stickers (12) — matches legacy advanced-shapes.js
// ============================================================
export interface AdvancedShape {
  value: string
  label: string
  hasText: boolean
  textLines: number // 1 for generic, 3 for coupon
}

export const ADVANCED_SHAPES: AdvancedShape[] = [
  { value: 'none', label: 'None', hasText: false, textLines: 0 },
  { value: 'rect-frame-text-top', label: 'Frame Text Top', hasText: true, textLines: 1 },
  { value: 'rect-frame-text-bottom', label: 'Frame Text Bottom', hasText: true, textLines: 1 },
  { value: 'simple-text-bottom', label: 'Simple Text Bottom', hasText: true, textLines: 1 },
  { value: 'simple-text-top', label: 'Simple Text Top', hasText: true, textLines: 1 },
  { value: 'four-corners-text-top', label: '4-Corners Top', hasText: true, textLines: 1 },
  { value: 'four-corners-text-bottom', label: '4-Corners Bottom', hasText: true, textLines: 1 },
  { value: 'coupon', label: 'Coupon', hasText: true, textLines: 3 },
  { value: 'review-collector', label: 'Review Collector', hasText: false, textLines: 0 },
  { value: 'healthcare', label: 'Healthcare', hasText: true, textLines: 1 },
  { value: 'pincode-protected', label: 'Pincode Protected', hasText: false, textLines: 0 },
  { value: 'qrcode-details', label: 'QR Details', hasText: true, textLines: 1 },
]

// Review collector preset logos
export const REVIEW_COLLECTOR_LOGOS = [
  'airbnb', 'aliexpress', 'amazon', 'appstore', 'bitcoin', 'booking',
  'discord', 'ebay', 'facebook', 'foursquare', 'google', 'google-maps',
  'googleplay', 'instagram', 'linkedin', 'pinterest', 'skype', 'snapchat',
  'telegram', 'tiktok', 'trendyol', 'tripadvisor', 'trustpilot', 'twitch',
  'twitter', 'wechat', 'whatsapp', 'yellowpages', 'yelp', 'yemeksepeti',
  'youtube', 'zoom',
]

// ============================================================
// Preset Logos for Logo Picker — matches legacy qrcg-logo-picker.js
// ============================================================
export const PRESET_LOGOS: { value: string; label: string }[] = [
  { value: 'address-book', label: 'Address Book' },
  { value: 'badoo', label: 'Badoo' },
  { value: 'buymeacoffee', label: 'Buy Me a Coffee' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'dropbox', label: 'Dropbox' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'google-calendar', label: 'Google Calendar' },
  { value: 'google-forms', label: 'Google Forms' },
  { value: 'google-maps', label: 'Google Maps' },
  { value: 'google-meet', label: 'Google Meet' },
  { value: 'google-sheets', label: 'Google Sheets' },
  { value: 'google-slides', label: 'Google Slides' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'patreon', label: 'Patreon' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'skype', label: 'Skype' },
  { value: 'snapchat', label: 'Snapchat' },
  { value: 'soundcloud', label: 'SoundCloud' },
  { value: 'spotify', label: 'Spotify' },
  { value: 'swarm', label: 'Swarm' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'viber', label: 'Viber' },
  { value: 'vimeo', label: 'Vimeo' },
  { value: 'vine', label: 'Vine' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'zoom-meeting', label: 'Zoom' },
]
