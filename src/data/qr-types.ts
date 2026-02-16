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

export interface QRCodeType {
  id: string;
  name: string;
  icon: LucideIcon;
  category: "Static" | "Dynamic";
  description: string;
}

// ── Static QR Types ──────────────────────────────────────────────
export const staticQRTypes: QRCodeType[] = [
  { id: "text", name: "URL / Link", icon: FileText, category: "Static", description: "Text content or URL encoded directly" },
  { id: "email", name: "Email (Static)", icon: Mail, category: "Static", description: "Send an email with predefined content" },
  { id: "call", name: "Call", icon: Phone, category: "Static", description: "Dial a phone number" },
  { id: "sms", name: "SMS (Static)", icon: MessageCircle, category: "Static", description: "Send an SMS message" },
  { id: "wifi", name: "WIFI", icon: Wifi, category: "Static", description: "Connect to a wireless network" },
  { id: "vcard", name: "VCard", icon: Contact, category: "Static", description: "Contact information (VCard)" },
  { id: "location", name: "Location", icon: MapPin, category: "Static", description: "Open a location on map" },
  { id: "crypto", name: "Crypto", icon: Coins, category: "Static", description: "Cryptocurrency wallet address" },
  { id: "instagram", name: "Instagram", icon: Instagram, category: "Static", description: "Link to Instagram profile" },
  { id: "facebook", name: "Facebook", icon: Facebook, category: "Static", description: "Link to Facebook page" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, category: "Static", description: "Link to LinkedIn profile" },
  { id: "youtube", name: "YouTube", icon: Youtube, category: "Static", description: "Link to YouTube channel/video" },
  { id: "telegram", name: "Telegram", icon: Send, category: "Static", description: "Open a Telegram chat" },
  { id: "facebookmessenger", name: "Messenger", icon: MessageSquare, category: "Static", description: "Open Facebook Messenger" },
  { id: "facetime", name: "FaceTime", icon: PhoneCall, category: "Static", description: "Start a FaceTime call" },
  { id: "zoom", name: "Zoom", icon: Video, category: "Static", description: "Join a Zoom meeting" },
  { id: "viber", name: "Viber Chat", icon: MessageCircle, category: "Static", description: "Open a Viber conversation" },
  { id: "x", name: "X (Twitter)", icon: Hash, category: "Static", description: "Link to X/Twitter profile" },
  { id: "googlemaps", name: "Google Maps", icon: Map, category: "Static", description: "Open location in Google Maps" },
  { id: "snapchat", name: "Snapchat", icon: Camera, category: "Static", description: "Open Snapchat profile" },
  { id: "spotify", name: "Spotify", icon: Music, category: "Static", description: "Link to Spotify content" },
  { id: "tiktok", name: "TikTok", icon: Video, category: "Static", description: "Link to TikTok profile" },
  { id: "upi", name: "UPI (Static)", icon: Banknote, category: "Static", description: "UPI payment address" },
  { id: "brazilpix", name: "Brazilian PIX", icon: CircleDollarSign, category: "Static", description: "Brazilian PIX payment" },
];

// ── Dynamic QR Types ─────────────────────────────────────────────
export const dynamicQRTypes: QRCodeType[] = [
  { id: "url", name: "Dynamic URL", icon: Globe, category: "Dynamic", description: "Trackable and editable website link" },
  { id: "vcard-plus", name: "vCard Plus", icon: User, category: "Dynamic", description: "Digital business card with landing page" },
  { id: "business-profile", name: "Business Profile", icon: Briefcase, category: "Dynamic", description: "Full business profile page" },
  { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, category: "Dynamic", description: "Direct link to WhatsApp chat" },
  { id: "restaurant-menu", name: "Restaurant Menu", icon: UtensilsCrossed, category: "Dynamic", description: "Digital restaurant menu" },
  { id: "product-catalogue", name: "Product Catalogue", icon: ShoppingBag, category: "Dynamic", description: "Showcase products digitally" },
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
  { id: "paypal", name: "PayPal", icon: CreditCard, category: "Dynamic", description: "PayPal payment link" },
  { id: "upi-dynamic", name: "UPI (Dynamic)", icon: Banknote, category: "Dynamic", description: "Dynamic UPI payment" },
  { id: "image-gallery", name: "Image Gallery", icon: ImageIcon, category: "Dynamic", description: "Showcase photos on a landing page" },
  { id: "video", name: "Video", icon: Video, category: "Dynamic", description: "Link to YouTube or host a video" },
  { id: "social-media", name: "Social Media", icon: Share2, category: "Dynamic", description: "Consolidated links to social profiles" },
];

export const allQRTypes = [...staticQRTypes, ...dynamicQRTypes];

export const getQRTypeById = (id: string) => allQRTypes.find(t => t.id === id);

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