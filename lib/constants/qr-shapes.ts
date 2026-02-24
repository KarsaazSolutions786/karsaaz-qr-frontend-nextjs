/**
 * QR Shape Constants — matches legacy frontend exactly
 *
 * Module shapes, finder styles, finder dot styles, outlined shapes, and advanced shapes
 */

import { ModuleShape, FinderStyle, FinderDotStyle } from '@/types/entities/designer'

// ============================================================
// Module Shapes (15) — matches legacy module-fields.js
// ============================================================
export interface ShapeOption<T extends string = string> {
  value: T
  label: string
  image?: string
}

export const MODULE_SHAPES: ShapeOption<ModuleShape>[] = [
  { value: 'square', label: 'Square', image: '/images/qr/modules/square.png' },
  { value: 'dots', label: 'Dots', image: '/images/qr/modules/dots.png' },
  { value: 'triangle', label: 'Triangle', image: '/images/qr/modules/triangle.png' },
  { value: 'rhombus', label: 'Rhombus', image: '/images/qr/modules/rhombus.png' },
  { value: 'star-5', label: 'Star 5', image: '/images/qr/modules/star-5.png' },
  { value: 'star-7', label: 'Star 7', image: '/images/qr/modules/star-7.png' },
  { value: 'roundness', label: 'Rounded', image: '/images/qr/modules/roundness.png' },
  { value: 'vertical-lines', label: 'V-Lines', image: '/images/qr/modules/vertical-lines.png' },
  { value: 'horizontal-lines', label: 'H-Lines', image: '/images/qr/modules/horizontal-lines.png' },
  { value: 'diamond', label: 'Diamond', image: '/images/qr/modules/diamond.png' },
  { value: 'fish', label: 'Fish', image: '/images/qr/modules/fish.png' },
  { value: 'tree', label: 'Tree', image: '/images/qr/modules/tree.png' },
  {
    value: 'twoTrianglesWithCircle',
    label: '2-Tri Circle',
    image: '/images/qr/modules/twoTrianglesWithCircle.png',
  },
  { value: 'fourTriangles', label: '4-Triangles', image: '/images/qr/modules/fourTriangles.png' },
  { value: 'triangle-end', label: 'Tri-End', image: '/images/qr/modules/triangle-end.png' },
]

// ============================================================
// Finder Frame Styles (9) — matches legacy module-fields.js
// ============================================================
export const FINDER_STYLES: ShapeOption<FinderStyle>[] = [
  { value: 'default', label: 'Default', image: '/images/qr/finders/default.png' },
  { value: 'eye-shaped', label: 'Eye Shaped', image: '/images/qr/finders/eye-shaped.png' },
  { value: 'octagon', label: 'Octagon', image: '/images/qr/finders/octagon.png' },
  { value: 'rounded-corners', label: 'Rounded', image: '/images/qr/finders/rounded-corners.png' },
  { value: 'whirlpool', label: 'Whirlpool', image: '/images/qr/finders/whirlpool.png' },
  { value: 'water-drop', label: 'Water Drop', image: '/images/qr/finders/water-drop.png' },
  { value: 'circle', label: 'Circle', image: '/images/qr/finders/circle.png' },
  { value: 'zigzag', label: 'Zigzag', image: '/images/qr/finders/zigzag.png' },
  { value: 'circle-dots', label: 'Circle Dots', image: '/images/qr/finders/circle-dots.png' },
]

// ============================================================
// Finder Dot Styles (8) — matches legacy module-fields.js
// ============================================================
export const FINDER_DOT_STYLES: ShapeOption<FinderDotStyle>[] = [
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
  image?: string
}

export const OUTLINED_SHAPES: OutlinedShape[] = [
  { value: 'none', label: 'None' },
  { value: 'circle', label: 'Circle', image: '/images/qr/shapes/shape-circle.jpg' },
  { value: 'cloud', label: 'Cloud', image: '/images/qr/shapes/shape-cloud.jpg' },
  {
    value: 'shopping-cart',
    label: 'Shopping Cart',
    image: '/images/qr/shapes/shape-shopping-cart.jpg',
  },
  { value: 'gift', label: 'Gift', image: '/images/qr/shapes/shape-gift.jpg' },
  { value: 'cup', label: 'Cup', image: '/images/qr/shapes/shape-cup.jpg' },
  { value: 't-shirt', label: 'T-Shirt', image: '/images/qr/shapes/shape-t-shirt.jpg' },
  { value: 'home', label: 'Home', image: '/images/qr/shapes/shape-home.jpg' },
  { value: 'book', label: 'Book', image: '/images/qr/shapes/shape-book.jpg' },
  { value: 'message', label: 'Message', image: '/images/qr/shapes/shape-message.jpg' },
  { value: 'bag', label: 'Bag', image: '/images/qr/shapes/shape-bag.jpg' },
  { value: 'truck', label: 'Truck', image: '/images/qr/shapes/shape-truck.jpg' },
  { value: 'trophy', label: 'Trophy', image: '/images/qr/shapes/shape-trophy.jpg' },
  { value: 'umbrella', label: 'Umbrella', image: '/images/qr/shapes/shape-umbrella.jpg' },
  { value: 'van', label: 'Van', image: '/images/qr/shapes/shape-van.jpg' },
  { value: 'watch', label: 'Watch', image: '/images/qr/shapes/shape-watch.jpg' },
  { value: 'water', label: 'Water', image: '/images/qr/shapes/shape-water.jpg' },
  { value: 'bulb', label: 'Bulb', image: '/images/qr/shapes/shape-bulb.jpg' },
  { value: 'sun', label: 'Sun', image: '/images/qr/shapes/shape-sun.jpg' },
  { value: 'car', label: 'Car', image: '/images/qr/shapes/shape-car.jpg' },
  { value: 'pet', label: 'Pet', image: '/images/qr/shapes/shape-pet.jpg' },
  { value: 'gym', label: 'GYM', image: '/images/qr/shapes/shape-gym.jpg' },
  { value: 'salon', label: 'Salon', image: '/images/qr/shapes/shape-salon.jpg' },
  { value: 'food', label: 'Food', image: '/images/qr/shapes/shape-food.jpg' },
  { value: 'ice-cream', label: 'Ice Cream', image: '/images/qr/shapes/shape-ice-cream.jpg' },
  { value: 'search', label: 'Search', image: '/images/qr/shapes/shape-search.jpg' },
  { value: 'burger', label: 'Burger', image: '/images/qr/shapes/shape-burger.jpg' },
  { value: 'apple', label: 'Apple', image: '/images/qr/shapes/shape-apple.jpg' },
  { value: 'barn', label: 'Barn', image: '/images/qr/shapes/shape-barn.jpg' },
  { value: 'sun-rise', label: 'Sunrise', image: '/images/qr/shapes/shape-sun-rise.jpg' },
  { value: 'star', label: 'Star', image: '/images/qr/shapes/shape-star.jpg' },
  { value: 'realtor', label: 'Realtor', image: '/images/qr/shapes/shape-realtor.jpg' },
  { value: 'legal', label: 'Legal', image: '/images/qr/shapes/shape-legal.jpg' },
  { value: 'juice', label: 'Juice', image: '/images/qr/shapes/shape-juice.jpg' },
  { value: 'water-glass', label: 'Water Glass', image: '/images/qr/shapes/shape-water-glass.jpg' },
  { value: 'electrician', label: 'Electrician', image: '/images/qr/shapes/shape-electrician.jpg' },
  { value: 'plumber', label: 'Plumber', image: '/images/qr/shapes/shape-plumber.jpg' },
  { value: 'builder', label: 'Builder', image: '/images/qr/shapes/shape-builder.jpg' },
  { value: 'home-mover', label: 'Home Mover', image: '/images/qr/shapes/shape-home-mover.jpg' },
  { value: 'cooking', label: 'Cooking', image: '/images/qr/shapes/shape-cooking.jpg' },
  { value: 'gardening', label: 'Gardening', image: '/images/qr/shapes/shape-gardening.jpg' },
  { value: 'furniture', label: 'Furniture', image: '/images/qr/shapes/shape-furniture.jpg' },
  { value: 'mobile', label: 'Mobile', image: '/images/qr/shapes/shape-mobile.jpg' },
  { value: 'restaurant', label: 'Restaurant', image: '/images/qr/shapes/shape-restaurant.jpg' },
  { value: 'travel', label: 'Travel', image: '/images/qr/shapes/shape-travel.jpg' },
  { value: 'dentist', label: 'Dentist', image: '/images/qr/shapes/shape-dentist.jpg' },
  { value: 'golf', label: 'Golf', image: '/images/qr/shapes/shape-golf.jpg' },
  { value: 'pizza', label: 'Pizza', image: '/images/qr/shapes/shape-pizza.jpg' },
  { value: 'locksmith', label: 'Locksmith', image: '/images/qr/shapes/shape-locksmith.jpg' },
  { value: 'bakery', label: 'Bakery', image: '/images/qr/shapes/shape-bakery.jpg' },
  { value: 'painter', label: 'Painter', image: '/images/qr/shapes/shape-painter.jpg' },
  { value: 'pest', label: 'Pest', image: '/images/qr/shapes/shape-pest.jpg' },
  { value: 'teddy', label: 'Teddy', image: '/images/qr/shapes/shape-teddy.jpg' },
  { value: 'boot', label: 'Boot', image: '/images/qr/shapes/shape-boot.jpg' },
  { value: 'shield', label: 'Shield', image: '/images/qr/shapes/shape-shield.jpg' },
  { value: 'shawarma', label: 'Shawarma', image: '/images/qr/shapes/shape-shawarma.jpg' },
  { value: 'ticket', label: 'Ticket', image: '/images/qr/shapes/shape-ticket.jpg' },
  { value: 'piggy-bank', label: 'Piggy Bank', image: '/images/qr/shapes/shape-piggy-bank.jpg' },
  {
    value: 'realtor-sign',
    label: 'Realtor Sign',
    image: '/images/qr/shapes/shape-realtor-sign.jpg',
  },
  { value: 'brain', label: 'Brain', image: '/images/qr/shapes/shape-brain.jpg' },
]

// ============================================================
// Advanced Shapes / Stickers (12) — matches legacy advanced-shapes.js
// ============================================================
export interface AdvancedShape {
  value: string
  label: string
  hasText: boolean
  textLines: number
  image?: string
}

export const ADVANCED_SHAPES: AdvancedShape[] = [
  {
    value: 'none',
    label: 'None',
    hasText: false,
    textLines: 0,
    image: '/images/qr/stickers/none.png',
  },
  {
    value: 'rect-frame-text-top',
    label: 'Frame Text Top',
    hasText: true,
    textLines: 1,
    image: '/images/qr/stickers/rect-frame-text-top.png',
  },
  {
    value: 'rect-frame-text-bottom',
    label: 'Frame Text Bottom',
    hasText: true,
    textLines: 1,
    image: '/images/qr/stickers/rect-frame-text-bottom.png',
  },
  {
    value: 'simple-text-bottom',
    label: 'Simple Text Bottom',
    hasText: true,
    textLines: 1,
    image: '/images/qr/stickers/simple-text-bottom.png',
  },
  {
    value: 'simple-text-top',
    label: 'Simple Text Top',
    hasText: true,
    textLines: 1,
    image: '/images/qr/stickers/simple-text-top.png',
  },
  {
    value: 'four-corners-text-top',
    label: '4-Corners Top',
    hasText: true,
    textLines: 1,
    image: '/images/qr/stickers/four-corners-text-top.png',
  },
  {
    value: 'four-corners-text-bottom',
    label: '4-Corners Bottom',
    hasText: true,
    textLines: 1,
    image: '/images/qr/stickers/four-corners-text-bottom.png',
  },
  {
    value: 'coupon',
    label: 'Coupon',
    hasText: true,
    textLines: 3,
    image: '/images/qr/stickers/coupon.png',
  },
  {
    value: 'review-collector',
    label: 'Review Collector',
    hasText: false,
    textLines: 0,
    image: '/images/qr/stickers/review-collector.png',
  },
  {
    value: 'healthcare',
    label: 'Healthcare',
    hasText: true,
    textLines: 1,
    image: '/images/qr/stickers/healthcare.png',
  },
  {
    value: 'pincode-protected',
    label: 'Pincode Protected',
    hasText: false,
    textLines: 0,
    image: '/images/qr/stickers/pincode-protected.png',
  },
  {
    value: 'qrcode-details',
    label: 'QR Details',
    hasText: true,
    textLines: 1,
    image: '/images/qr/stickers/qrcode-details.png',
  },
]

// Review collector preset logos
export const REVIEW_COLLECTOR_LOGOS = [
  'airbnb',
  'aliexpress',
  'amazon',
  'appstore',
  'bitcoin',
  'booking',
  'discord',
  'ebay',
  'facebook',
  'foursquare',
  'google',
  'google-maps',
  'googleplay',
  'instagram',
  'linkedin',
  'pinterest',
  'skype',
  'snapchat',
  'telegram',
  'tiktok',
  'trendyol',
  'tripadvisor',
  'trustpilot',
  'twitch',
  'twitter',
  'wechat',
  'whatsapp',
  'yellowpages',
  'yelp',
  'yemeksepeti',
  'youtube',
  'zoom',
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
