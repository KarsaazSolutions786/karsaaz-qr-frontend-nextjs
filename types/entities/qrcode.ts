import { DesignerConfig } from './designer';
import { StickerConfig } from './sticker';

export type QRCodeType =
  | 'url'
  | 'vcard'
  | 'wifi'
  | 'text'
  | 'email'
  | 'sms'
  | 'phone'
  | 'location'
  | 'calendar'
  | 'app-store'

export interface URLData {
  url: string // Target URL
}

export interface VCardData {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  organization?: string
  title?: string
  address?: string
  website?: string
}

export interface WiFiData {
  ssid: string // Network name
  password: string // Network password
  encryption: 'WPA' | 'WEP' | 'nopass'
  hidden: boolean // Hidden network
}

export interface TextData {
  text: string
}

export interface EmailData {
  email: string
  subject?: string
  body?: string
}

export interface SMSData {
  phone: string
  message?: string
}

export interface PhoneData {
  phone: string
}

export interface LocationData {
  latitude: number
  longitude: number
  address?: string
}

export interface CalendarData {
  title: string
  description?: string
  location?: string
  startTime: string // ISO 8601
  endTime: string // ISO 8601
}

export interface AppStoreData {
  appName: string
  iosUrl?: string
  androidUrl?: string
}

export type QRCodeData =
  | URLData
  | VCardData
  | WiFiData
  | TextData
  | EmailData
  | SMSData
  | PhoneData
  | LocationData
  | CalendarData
  | AppStoreData

export interface QRCustomization {
  foregroundColor: string // Hex color (default: #000000)
  backgroundColor: string // Hex color (default: #FFFFFF)
  logoUrl?: string // Logo image URL (optional)
  style: 'squares' | 'dots' | 'rounded' // QR code style
  size: number // Size in pixels (default: 500)
}

export interface QRCode {
  id: string // UUID
  userId: string // Owner ID
  name: string // User-defined name
  type: QRCodeType // QR code type
  data: QRCodeData // Type-specific data (union type)
  customization: QRCustomization // Basic customization (legacy)
  designerConfig?: DesignerConfig // Advanced designer configuration (new)
  stickerConfig?: StickerConfig // Sticker configuration (new)
  folderId?: string | null // Folder ID (new)
  status?: 'active' | 'inactive' | 'archived' // Status (new)
  tags?: string[] // Tags for organization (new)
  domainId?: string // Custom domain (optional)
  password?: string // PIN protection (hashed, optional)
  screenshotUrl?: string // Landing page screenshot (optional)
  createdAt: string // ISO 8601 timestamp
  updatedAt: string // ISO 8601 timestamp
  scans: number // Total scan count (cached)
}
