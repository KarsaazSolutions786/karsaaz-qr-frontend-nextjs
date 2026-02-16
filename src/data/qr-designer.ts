/**
 * QR Designer Defaults and Constants
 * Matches backend App\Models\QRCode::setDesignAttribute defaults
 */

export const DEFAULT_DESIGN = {
  fillType: "solid",
  foregroundColor: "#000000",
  eyeInternalColor: "#000000",
  eyeExternalColor: "#000000",
  backgroundColor: "#ffffff",
  backgroundEnabled: true,
  gradientFill: { 
    type: "RADIAL", 
    colors: ["#000000", "#1c57cb"], 
    rotation: 0 
  },
  foregroundImage: null,
  module: "square",
  finder: "default",
  finderDot: "default",
  shape: "none",
  frameColor: "#000000",
  logoScale: 0.2,
  logoPositionX: 0.5,
  logoPositionY: 0.5,
  logoRotate: 0,
  logoBackground: true,
  logoBackgroundFill: "#ffffff",
  logoBackgroundShape: "circle",
  logoBackgroundScale: 1.5,
  logoType: "none",
  advancedShape: "none",
  advancedShapeDropShadow: true,
  advancedShapeFrameColor: "#000000",
  
  // Text / Sticker Properties
  text: "SCAN ME",
  textColor: "#ffffff",
  textBackgroundColor: "#000000",
  fontFamily: "Inter",
  fontVariant: "700",
  textSize: "1",
  
  // Specialized Sticker Defaults
  healthcareFrameColor: "#CC0032",
  healthcareHeartColor: "#ffffff",
  couponLeftColor: "#000000",
  couponRightColor: "#CC0032",
  couponText1: "EXCLUSIVE",
  couponText2: "OFFER",
  couponText3: "50% OFF",
  reviewCollectorCircleColor: "#000000",
  reviewCollectorStarsColor: "#FFD700",
  reviewCollectorLogoSrc: "google",
  
  // AI Properties
  is_ai: false,
  ai_prompt: "",
  ai_strength: 1.8,
  ai_steps: 18,
  ai_model: "1.1",
};

export const LOGO_BACKGROUND_SHAPES = [
  { label: "Circle", value: "circle" },
  { label: "Square", value: "square" }
];

export const GRADIENT_TYPES = [
  { label: "Linear", value: "LINEAR", id: "LINEAR", name: "Linear" },
  { label: "Radial", value: "RADIAL", id: "RADIAL", name: "Radial" }
];

// Re-added missing exports for components
export const moduleTypes = [
  'square', 'dots', 'triangle', 'rhombus', 'star-5', 'star-7', 'roundness', 
  'vertical-lines', 'horizontal-lines', 'diamond', 'fish', 'tree', 
  'twoTrianglesWithCircle', 'fourTriangles', 'triangle-end'
].map(id => ({ id, name: id.charAt(0).toUpperCase() + id.slice(1), preview: `/assets/images/modules/${id}.png` }));

export const eyeTypes = [
  'default', 'eye-shaped', 'octagon', 'rounded-corners', 'whirlpool', 
  'water-drop', 'circle', 'zigzag', 'circle-dots'
].map(id => ({ id, name: id.charAt(0).toUpperCase() + id.slice(1), preview: `/assets/images/finders/${id}.png` }));

export const ballTypes = [
  'default', 'eye-shaped', 'octagon', 'rounded-corners', 'whirlpool', 
  'water-drop', 'circle', 'zigzag'
].map(id => ({ id, name: id.charAt(0).toUpperCase() + id.slice(1), preview: `/assets/images/finders/dots/${id}.png` }));

export const qrShapes = [
  'None', 'Circle', 'Cloud', 'Shopping Cart', 'Gift', 'Cup', 'T-Shirt', 'Home', 'Book', 'Message', 
  'Bag', 'Truck', 'Trophy', 'Umbrella', 'Van', 'Watch', 'Water', 'Bulb', 'Sun', 'Car', 'Pet', 
  'GYM', 'Salon', 'Food', 'Ice Cream', 'Search', 'Burger', 'Apple', 'Barn', 'Sun Rise', 'Star', 
  'Realtor', 'Legal', 'Juice', 'Water Glass', 'Electrician', 'Plumber', 'Builder', 'Home Mover', 
  'Cooking', 'Gardening', 'Furniture', 'Mobile', 'Restaurant', 'Travel', 'Dentist', 'Golf', 'Pizza', 
  'Locksmith', 'Bakery', 'Painter', 'Pest', 'Teddy', 'Boot', 'Shield', 'Shawarma', 'Ticket', 
  'Piggy Bank', 'Realtor Sign', 'Brain'
].map(name => {
  const value = name.toLowerCase().replace(/ /g, '-');
  return { id: value, name, value };
});

export const advancedShapes = [
  'none', 'rect-frame-text-top', 'rect-frame-text-bottom', 'simple-text-bottom', 'simple-text-top', 
  'four-corners-text-top', 'four-corners-text-bottom', 'coupon', 'review-collector', 'healthcare', 
  'pincode-protected', 'qrcode-details'
].map(value => ({ id: value, name: value.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), value }));

// Compatibility alias
export const gradientTypes = GRADIENT_TYPES;
