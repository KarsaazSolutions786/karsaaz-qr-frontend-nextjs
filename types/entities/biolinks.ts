/**
 * Biolinks QR Type System
 * Dynamic landing page builder with multiple content blocks
 */

export enum BlockType {
  LINK = 'link',
  TEXT = 'text',
  HEADING = 'heading',
  SOCIAL_LINKS = 'social_links',
  IMAGE = 'image',
  VIDEO = 'video',
  DIVIDER = 'divider',
  CONTACT = 'contact',
  EMAIL = 'email',
  PHONE = 'phone',
  LOCATION = 'location',
  EMBED = 'embed',
  DOWNLOAD = 'download',
  PAYMENT = 'payment',
  NEWSLETTER = 'newsletter',
}

export interface BaseBlock {
  id: string;
  type: BlockType;
  visible: boolean;
  order: number;
}

export interface LinkBlock extends BaseBlock {
  type: BlockType.LINK;
  title: string;
  url: string;
  icon?: string;
  thumbnail?: string;
}

export interface TextBlock extends BaseBlock {
  type: BlockType.TEXT;
  content: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface HeadingBlock extends BaseBlock {
  type: BlockType.HEADING;
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface SocialLinksBlock extends BaseBlock {
  type: BlockType.SOCIAL_LINKS;
  links: SocialLink[];
  style: 'icons' | 'buttons' | 'minimal';
}

export interface ImageBlock extends BaseBlock {
  type: BlockType.IMAGE;
  url: string;
  alt?: string;
  link?: string;
  caption?: string;
}

export interface VideoBlock extends BaseBlock {
  type: BlockType.VIDEO;
  url: string;
  platform?: 'youtube' | 'vimeo' | 'custom';
  thumbnail?: string;
  title?: string;
}

export interface DividerBlock extends BaseBlock {
  type: BlockType.DIVIDER;
  style: 'solid' | 'dashed' | 'dotted' | 'double';
  color?: string;
}

export interface ContactBlock extends BaseBlock {
  type: BlockType.CONTACT;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface EmailBlock extends BaseBlock {
  type: BlockType.EMAIL;
  email: string;
  subject?: string;
  buttonText?: string;
}

export interface PhoneBlock extends BaseBlock {
  type: BlockType.PHONE;
  phone: string;
  buttonText?: string;
  showWhatsApp?: boolean;
}

export interface LocationBlock extends BaseBlock {
  type: BlockType.LOCATION;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  mapUrl?: string;
}

export interface EmbedBlock extends BaseBlock {
  type: BlockType.EMBED;
  embedCode: string;
  height?: number;
}

export interface DownloadBlock extends BaseBlock {
  type: BlockType.DOWNLOAD;
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
}

export interface PaymentBlock extends BaseBlock {
  type: BlockType.PAYMENT;
  amount: number;
  currency: string;
  description: string;
  paymentUrl: string;
}

export interface NewsletterBlock extends BaseBlock {
  type: BlockType.NEWSLETTER;
  title: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  apiEndpoint: string;
}

export type BiolinkBlock =
  | LinkBlock
  | TextBlock
  | HeadingBlock
  | SocialLinksBlock
  | ImageBlock
  | VideoBlock
  | DividerBlock
  | ContactBlock
  | EmailBlock
  | PhoneBlock
  | LocationBlock
  | EmbedBlock
  | DownloadBlock
  | PaymentBlock
  | NewsletterBlock;

export interface ThemeSettings {
  // Background
  backgroundColor?: string;
  backgroundGradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  backgroundImage?: string;
  backgroundBlur?: number;

  // Typography
  fontFamily?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;

  // Buttons
  buttonStyle?: 'rounded' | 'square' | 'pill';
  buttonColor?: string;
  buttonTextColor?: string;
  buttonBorderWidth?: number;
  buttonBorderColor?: string;
  buttonShadow?: boolean;

  // Layout
  maxWidth?: number;
  padding?: number;
  spacing?: number;
  borderRadius?: number;

  // Custom CSS
  customCss?: string;

  // Animation
  enableAnimations?: boolean;
  animationType?: 'fade' | 'slide' | 'scale';
}

export interface ProfileSettings {
  name: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  showAvatar?: boolean;
  showBio?: boolean;
}

export interface BiolinksData {
  id?: string;
  qrCodeId: string;
  profile: ProfileSettings;
  blocks: BiolinkBlock[];
  theme: ThemeSettings;
  seo?: {
    title?: string;
    description?: string;
    image?: string;
  };
  analytics?: {
    trackClicks?: boolean;
    trackViews?: boolean;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BiolinksFormData {
  profile: ProfileSettings;
  blocks: BiolinkBlock[];
  theme: ThemeSettings;
}

// Block template for creating new blocks
export const createBlockTemplate = (type: BlockType, order: number): BiolinkBlock => {
  const baseBlock = {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    visible: true,
    order,
  };

  switch (type) {
    case BlockType.LINK:
      return {
        ...baseBlock,
        type: BlockType.LINK,
        title: '',
        url: '',
      };
    case BlockType.TEXT:
      return {
        ...baseBlock,
        type: BlockType.TEXT,
        content: '',
        alignment: 'center',
      };
    case BlockType.HEADING:
      return {
        ...baseBlock,
        type: BlockType.HEADING,
        text: '',
        level: 2,
      };
    case BlockType.SOCIAL_LINKS:
      return {
        ...baseBlock,
        type: BlockType.SOCIAL_LINKS,
        links: [],
        style: 'icons',
      };
    case BlockType.IMAGE:
      return {
        ...baseBlock,
        type: BlockType.IMAGE,
        url: '',
      };
    case BlockType.VIDEO:
      return {
        ...baseBlock,
        type: BlockType.VIDEO,
        url: '',
      };
    case BlockType.DIVIDER:
      return {
        ...baseBlock,
        type: BlockType.DIVIDER,
        style: 'solid',
      };
    case BlockType.CONTACT:
      return {
        ...baseBlock,
        type: BlockType.CONTACT,
        name: '',
      };
    case BlockType.EMAIL:
      return {
        ...baseBlock,
        type: BlockType.EMAIL,
        email: '',
        buttonText: 'Send Email',
      };
    case BlockType.PHONE:
      return {
        ...baseBlock,
        type: BlockType.PHONE,
        phone: '',
        buttonText: 'Call Now',
      };
    case BlockType.LOCATION:
      return {
        ...baseBlock,
        type: BlockType.LOCATION,
        address: '',
      };
    case BlockType.EMBED:
      return {
        ...baseBlock,
        type: BlockType.EMBED,
        embedCode: '',
        height: 400,
      };
    case BlockType.DOWNLOAD:
      return {
        ...baseBlock,
        type: BlockType.DOWNLOAD,
        fileName: '',
        fileUrl: '',
      };
    case BlockType.PAYMENT:
      return {
        ...baseBlock,
        type: BlockType.PAYMENT,
        amount: 0,
        currency: 'USD',
        description: '',
        paymentUrl: '',
      };
    case BlockType.NEWSLETTER:
      return {
        ...baseBlock,
        type: BlockType.NEWSLETTER,
        title: 'Subscribe to Newsletter',
        placeholder: 'Enter your email',
        buttonText: 'Subscribe',
        apiEndpoint: '',
      };
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};

// Default theme
export const defaultTheme: ThemeSettings = {
  backgroundColor: '#ffffff',
  primaryColor: '#3b82f6',
  secondaryColor: '#6366f1',
  textColor: '#1f2937',
  buttonStyle: 'rounded',
  buttonColor: '#3b82f6',
  buttonTextColor: '#ffffff',
  buttonBorderWidth: 0,
  buttonShadow: true,
  maxWidth: 680,
  padding: 24,
  spacing: 16,
  borderRadius: 12,
  enableAnimations: true,
  animationType: 'fade',
};
