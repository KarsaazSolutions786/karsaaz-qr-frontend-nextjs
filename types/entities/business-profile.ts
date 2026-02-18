/**
 * Business Profile QR Type System
 * Comprehensive business information and showcase
 */

export interface BusinessBasicInfo {
  name: string;
  tagline?: string;
  description?: string;
  logo?: string;
  category?: string;
}

export interface BusinessContact {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: SocialMediaLinks;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: string;
  duration?: string;
  icon?: string;
  image?: string;
  order: number;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breaks?: {
    startTime: string;
    endTime: string;
  }[];
  note?: string;
}

export interface OpeningHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
  timezone?: string;
  specialHours?: string;
}

export interface TeamMember {
  id: string;
  photo?: string;
  name: string;
  title: string;
  bio?: string;
  email?: string;
  phone?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
  };
  order: number;
  featured?: boolean;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  alt?: string;
  order: number;
}

export interface BusinessTheme {
  // Colors
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;

  // Typography
  fontFamily?: string;
  headingFont?: string;

  // Layout
  layout?: 'modern' | 'classic' | 'minimal' | 'corporate';
  cardStyle?: 'rounded' | 'square' | 'elevated';
  borderRadius?: number;

  // Header
  headerStyle?: 'center' | 'left' | 'full-width';
  showLogo?: boolean;
  logoSize?: 'small' | 'medium' | 'large';

  // Sections
  showSections?: {
    basicInfo?: boolean;
    contact?: boolean;
    services?: boolean;
    hours?: boolean;
    team?: boolean;
    gallery?: boolean;
  };

  // Buttons
  buttonStyle?: 'filled' | 'outlined' | 'text';
  buttonShape?: 'rounded' | 'square' | 'pill';

  // Custom CSS
  customCss?: string;
}

export interface BusinessProfileData {
  id?: string;
  qrCodeId: string;
  basicInfo: BusinessBasicInfo;
  contact: BusinessContact;
  services?: Service[];
  openingHours?: OpeningHours;
  team?: TeamMember[];
  gallery?: GalleryImage[];
  theme: BusinessTheme;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
  };
  analytics?: {
    trackViews?: boolean;
    trackClicks?: boolean;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessProfileFormData {
  basicInfo: BusinessBasicInfo;
  contact: BusinessContact;
  services: Service[];
  openingHours: OpeningHours;
  team: TeamMember[];
  gallery: GalleryImage[];
  theme: BusinessTheme;
}

// Default values
export const defaultDaySchedule: DaySchedule = {
  isOpen: false,
  openTime: '09:00',
  closeTime: '17:00',
  breaks: [],
};

export const defaultOpeningHours: OpeningHours = {
  monday: { isOpen: true, openTime: '09:00', closeTime: '17:00', breaks: [] },
  tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00', breaks: [] },
  wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00', breaks: [] },
  thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00', breaks: [] },
  friday: { isOpen: true, openTime: '09:00', closeTime: '17:00', breaks: [] },
  saturday: { isOpen: false, openTime: '10:00', closeTime: '14:00', breaks: [] },
  sunday: { isOpen: false, openTime: '10:00', closeTime: '14:00', breaks: [] },
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export const defaultBusinessTheme: BusinessTheme = {
  primaryColor: '#3b82f6',
  secondaryColor: '#6366f1',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  accentColor: '#10b981',
  fontFamily: 'Inter, sans-serif',
  headingFont: 'Inter, sans-serif',
  layout: 'modern',
  cardStyle: 'rounded',
  borderRadius: 12,
  headerStyle: 'center',
  showLogo: true,
  logoSize: 'medium',
  showSections: {
    basicInfo: true,
    contact: true,
    services: true,
    hours: true,
    team: true,
    gallery: true,
  },
  buttonStyle: 'filled',
  buttonShape: 'rounded',
};

// Helper functions
export const createService = (order: number): Service => ({
  id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: '',
  description: '',
  price: '',
  duration: '',
  order,
});

export const createTeamMember = (order: number): TeamMember => ({
  id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: '',
  title: '',
  bio: '',
  order,
  featured: false,
});

export const createGalleryImage = (url: string, order: number): GalleryImage => ({
  id: `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  url,
  caption: '',
  alt: '',
  order,
});
