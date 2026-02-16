import {
  Banknote,
  Briefcase,
  Calendar,
  Camera,
  CircleDollarSign,
  Coins,
  Contact,
  CreditCard,
  Facebook,
  FileText,
  FileUp,
  Globe,
  Hash,
  ImageIcon,
  Instagram,
  Linkedin,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  MessageSquare,
  Music,
  Phone,
  PhoneCall,
  Send,
  Share2,
  ShoppingBag,
  Smartphone,
  Star,
  User,
  UtensilsCrossed,
  Video,
  Wifi,
  Youtube,
  type LucideIcon
} from "lucide-react";

export type QRCardSize = "wide" | "tall" | "icon-only" | "standard";

export interface QRCodeType {
  id: string;
  name: string;
  icon: LucideIcon;
  category: "Static" | "Dynamic";
  description: string;
  /** Path to branded PNG icon in /images/png-logos/ (optional) */
  brandedIcon?: string;
  /** Card display size in the creation grid */
  cardSize?: QRCardSize;
  /** Whether this is a premium feature */
  isPremium?: boolean;
}

// Branded icon path helper
const logo = (name: string) => `/images/png-logos/${name}.png`;

// ── QR Types ordered to match Figma layout ─────────────────────────
// Row 1: Two wide cards
export const featuredTypes: QRCodeType[] = [
  { id: "text", name: "URL / LINK", icon: Globe, category: "Static", description: "Text content or URL encoded directly", cardSize: "wide" },
  { id: "vcard", name: "VCard", icon: Contact, category: "Static", description: "Contact information (VCard)", cardSize: "wide" },
];

// Row 2: Standard cards
export const standardTypes: QRCodeType[] = [
  { id: "url", name: "Dynamic URL", icon: Globe, category: "Dynamic", description: "Trackable and editable website link" },
  { id: "business-profile", name: "Business Profile", icon: Briefcase, category: "Dynamic", description: "Full business profile page" },
  { id: "restaurant-menu", name: "Restaurant Menu", icon: UtensilsCrossed, category: "Dynamic", description: "Digital restaurant menu", cardSize: "tall" },
  { id: "vcard-plus", name: "VCard Plus", icon: User, category: "Dynamic", description: "Digital business card with landing page", isPremium: true },
];

// Row 3: Email + social icon-only cards
export const communicationTypes: QRCodeType[] = [
  { id: "email", name: "Email", icon: Mail, category: "Static", description: "Send an email with predefined content" },
  { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, category: "Dynamic", description: "Direct link to WhatsApp chat", brandedIcon: logo("whatsapp"), cardSize: "icon-only" },
  { id: "telegram", name: "Telegram", icon: Send, category: "Static", description: "Open a Telegram chat", brandedIcon: logo("telegram"), cardSize: "icon-only" },
  { id: "youtube", name: "YouTube", icon: Youtube, category: "Static", description: "Link to YouTube channel/video", brandedIcon: logo("youtube"), cardSize: "icon-only" },
  { id: "facebook", name: "Facebook", icon: Facebook, category: "Static", description: "Link to Facebook page", brandedIcon: logo("facebook"), cardSize: "icon-only" },
];

// Row 4: More standard + social icons
export const advancedTypes: QRCodeType[] = [
  { id: "product-catalogue", name: "Product Catalogue", icon: ShoppingBag, category: "Dynamic", description: "Showcase products digitally" },
  { id: "facebookmessenger", name: "Messenger", icon: MessageSquare, category: "Static", description: "Open Facebook Messenger", cardSize: "icon-only" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, category: "Static", description: "Link to LinkedIn profile", brandedIcon: logo("linkedin"), cardSize: "icon-only" },
];

// Row 5: Call, FaceTime + social icons
export const callTypes: QRCodeType[] = [
  { id: "call", name: "Call", icon: Phone, category: "Static", description: "Dial a phone number" },
  { id: "facetime", name: "FaceTime", icon: PhoneCall, category: "Static", description: "Start a FaceTime call" },
  { id: "viber", name: "Viber Chat", icon: MessageCircle, category: "Static", description: "Open a Viber conversation", brandedIcon: logo("viber"), cardSize: "icon-only" },
];

// Row 6: Paypal + more
export const paymentTypes: QRCodeType[] = [
  { id: "paypal", name: "Paypal", icon: CreditCard, category: "Dynamic", description: "PayPal payment link", brandedIcon: logo("paypal") },
  { id: "crypto", name: "Crypto currency", icon: Coins, category: "Static", description: "Cryptocurrency wallet address" },
  { id: "x", name: "X (Twitter)", icon: Hash, category: "Static", description: "Link to X/Twitter profile", brandedIcon: logo("twitter"), cardSize: "icon-only" },
  { id: "instagram", name: "Instagram", icon: Instagram, category: "Static", description: "Link to Instagram profile", brandedIcon: logo("instagram"), cardSize: "icon-only" },
  { id: "brazilpix", name: "Brazilian PIX", icon: CircleDollarSign, category: "Static", description: "Brazilian PIX payment" },
  { id: "snapchat", name: "Snapchat", icon: Camera, category: "Static", description: "Open Snapchat profile", brandedIcon: logo("snapchat"), cardSize: "icon-only" },
  { id: "spotify", name: "Spotify", icon: Music, category: "Static", description: "Link to Spotify content", brandedIcon: logo("spotify"), cardSize: "icon-only" },
];

// ── Extended types (shown after "View More") ────────────────────────
export const extendedTypes: QRCodeType[] = [
  { id: "wifi", name: "WIFI", icon: Wifi, category: "Static", description: "Connect to a wireless network" },
  { id: "location", name: "Location", icon: MapPin, category: "Static", description: "Open a location on map" },
  { id: "sms", name: "SMS", icon: MessageCircle, category: "Static", description: "Send an SMS message" },
  { id: "biolinks", name: "Bio Links", icon: Hash, category: "Dynamic", description: "Personalized links landing page" },
  { id: "business-review", name: "Business Review", icon: Star, category: "Dynamic", description: "Collect business reviews" },
  { id: "website-builder", name: "Website Builder", icon: Globe, category: "Dynamic", description: "Build a mini landing page" },
  { id: "lead-form", name: "Lead Form", icon: FileText, category: "Dynamic", description: "Collect leads through forms" },
  { id: "app-download", name: "App Download", icon: Smartphone, category: "Dynamic", description: "Link to App Store and Play Store" },
  { id: "google-review", name: "Google Review", icon: Star, category: "Dynamic", description: "Direct link to Google review" },
  { id: "resume", name: "Resume QR Code", icon: FileText, category: "Dynamic", description: "Share your resume digitally" },
  { id: "file-upload", name: "File Upload", icon: FileUp, category: "Dynamic", description: "Host and share file downloads" },
  { id: "event", name: "Event", icon: Calendar, category: "Dynamic", description: "Trackable event invitations" },
  { id: "email-dynamic", name: "Email (Dynamic)", icon: Mail, category: "Dynamic", description: "Dynamic trackable email QR" },
  { id: "sms-dynamic", name: "SMS (Dynamic)", icon: MessageCircle, category: "Dynamic", description: "Dynamic trackable SMS QR" },
  { id: "upi", name: "UPI (Static)", icon: Banknote, category: "Static", description: "UPI payment address" },
  { id: "upi-dynamic", name: "UPI (Dynamic)", icon: Banknote, category: "Dynamic", description: "Dynamic UPI payment" },
  { id: "image-gallery", name: "Image Gallery", icon: ImageIcon, category: "Dynamic", description: "Showcase photos on a landing page" },
  { id: "video", name: "Video", icon: Video, category: "Dynamic", description: "Link to YouTube or host a video" },
  { id: "social-media", name: "Social Media", icon: Share2, category: "Dynamic", description: "Consolidated links to social profiles" },
  { id: "googlemaps", name: "Google Maps", icon: Map, category: "Static", description: "Open location in Google Maps" },
  { id: "tiktok", name: "TikTok", icon: Video, category: "Static", description: "Link to TikTok profile" },
  { id: "zoom", name: "Zoom", icon: Video, category: "Static", description: "Join a Zoom meeting", brandedIcon: logo("zoom-meeting") },
];

// ── Keep backward-compatible exports ────────────────────────────────
export const staticQRTypes: QRCodeType[] = [
  ...featuredTypes.filter(t => t.category === "Static"),
  ...communicationTypes.filter(t => t.category === "Static"),
  ...callTypes.filter(t => t.category === "Static"),
  ...paymentTypes.filter(t => t.category === "Static"),
  ...extendedTypes.filter(t => t.category === "Static"),
];

export const dynamicQRTypes: QRCodeType[] = [
  ...standardTypes.filter(t => t.category === "Dynamic"),
  ...communicationTypes.filter(t => t.category === "Dynamic"),
  ...advancedTypes.filter(t => t.category === "Dynamic"),
  ...paymentTypes.filter(t => t.category === "Dynamic"),
  ...extendedTypes.filter(t => t.category === "Dynamic"),
];

/** Ordered sections for Figma grid layout */
export const qrTypeSections = [
  featuredTypes,
  standardTypes,
  communicationTypes,
  advancedTypes,
  callTypes,
  paymentTypes,
];

export const allQRTypes = [...staticQRTypes, ...dynamicQRTypes];

export const getQRTypeById = (id: string) => {
  const all = [
    ...featuredTypes, ...standardTypes, ...communicationTypes,
    ...advancedTypes, ...callTypes, ...paymentTypes, ...extendedTypes
  ];
  return all.find(t => t.id === id);
};

export const socialMediaTypes: Record<string, boolean> = {
  facebook: true,
  instagram: true,
  linkedin: true,
  youtube: true,
  telegram: true,
  whatsapp: true,
  facebookmessenger: true,
  viber: true,
  call: true,
};