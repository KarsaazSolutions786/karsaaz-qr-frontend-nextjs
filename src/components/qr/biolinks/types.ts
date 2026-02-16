/**
 * Biolink Block System Types
 * Type definitions for the biolink block editor
 */

import { LucideIcon } from 'lucide-react';

// Block Content Type Definitions
export interface LinkBlockContent {
  title: string;
  subtitle?: string;
  url: string;
  icon?: string;
  openInNewTab?: boolean;
}

export interface TextBlockContent {
  content: string;
  alignment?: 'left' | 'center' | 'right';
  enableMarkdown?: boolean;
}

export interface ImageBlockContent {
  url: string;
  alt?: string;
  title?: string;
  caption?: string;
  link?: string;
  width?: string;
  height?: string;
}

export interface VideoBlockContent {
  url: string;
  title?: string;
  description?: string;
  platform?: 'youtube' | 'vimeo' | 'custom';
  autoplay?: boolean;
  controls?: boolean;
  privacyMode?: boolean;
}

export interface AudioBlockContent {
  url: string;
  title?: string;
  artist?: string;
  cover?: string;
  autoplay?: boolean;
  controls?: boolean;
}

export interface TitleBlockContent {
  text: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
  alignment?: 'left' | 'center' | 'right';
  fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
  bold?: boolean;
  italic?: boolean;
}

export interface ParagraphBlockContent {
  text: string;
  alignment?: 'left' | 'center' | 'right';
  enableHtml?: boolean;
  maxLength?: number;
  placeholder?: string;
  wordWrap?: 'normal' | 'break-word' | 'break-all';
  lineHeight?: number;
  fontSize?: string;
}

export interface ImageGridBlockContent {
  images: Array<{
    url: string;
    alt?: string;
    title?: string;
    caption?: string;
    link?: string;
  }>;
  columns?: 1 | 2 | 3 | 4;
  gap?: string;
}

export interface ListBlockContent {
  items: Array<{
    id: string;
    text: string;
    checked?: boolean;
    indentLevel?: number;
    icon?: string | null;
  }>;
  type?: 'bullet' | 'numbered' | 'checklist';
  bulletIcon?: 'disc' | 'circle' | 'square' | 'dash' | 'star' | 'arrow';
  showRichText?: boolean;
  spacing?: 'compact' | 'normal' | 'relaxed';
  startNumber?: number;
  customBulletIcon?: string;
}

export interface FAQBlockContent {
  items: Array<{
    question: string;
    answer: string;
    open?: boolean;
  }>;
  allowMultipleOpen?: boolean;
}

export interface SocialLinksBlockContent {
  links: Array<{
    platform: string;
    url: string;
    title?: string;
  }>;
  style?: 'icons' | 'buttons' | 'list';
  showPlatformName?: boolean;
}

export interface ShareBlockContent {
  platforms: string[];
  url?: string;
  title?: string;
  description?: string;
}

export interface ProfileBlockContent {
  name: string;
  bio?: string;
  avatar?: string;
  cover?: string;
  website?: string;
  location?: string;
  verified?: boolean;
}

export interface BusinessHoursBlockContent {
  timezone: string;
  hours: Array<{
    day: string;
    open: string;
    close: string;
    closed?: boolean;
  }>;
  showCurrentStatus?: boolean;
  holidayMode?: boolean;
}

export interface ContactMethod {
  id: string;
  type: 'email' | 'phone' | 'address' | 'website';
  label: string;
  value: string;
  icon?: string;
  link?: string;
}

export interface BusinessHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface ContactBlockContent {
  // Contact Information
  methods: ContactMethod[];
  showForm: boolean;
  formTitle: string;
  formSubtitle: string;
  
  // Business Hours
  showBusinessHours: boolean;
  businessHours: BusinessHour[];
  timezone: string;
  
  // Map
  showMap: boolean;
  mapUrl: string;
  mapHeight: string;
  
  // Response Time
  showResponseTime: boolean;
  responseTime: string;
  
  // Form Configuration
  requirePhone: boolean;
  requireSubject: boolean;
  emailTo: string;
  ccEmail?: string;
  bccEmail?: string;
  
  // Spam Protection
  enableHoneypot: boolean;
  honeypotField: string;
  
  // Messages
  successMessage: string;
  errorMessage: string;
  buttonText: string;
  privacyText: string;
}

export interface DividerBlockContent {
  type?: 'line' | 'dashed' | 'dotted' | 'space';
  thickness?: number;
  color?: string;
  width?: 'full' | 'large' | 'medium' | 'small';
  label?: string;
  icon?: string;
  marginTop?: number;
  marginBottom?: number;
}

export interface FileBlockContent {
  files: UploadedFile[];
  title?: string;
  description?: string;
  showFileSize?: boolean;
  showFileType?: boolean;
  allowMultiple?: boolean;
  maxFileSize?: number;
  allowedTypes?: string[];
  downloadTracking?: boolean;
}

// Union Type for all block content
export type BlockContent = 
  | LinkBlockContent
  | TextBlockContent
  | ImageBlockContent
  | VideoBlockContent
  | AudioBlockContent
  | TitleBlockContent
  | ParagraphBlockContent
  | ImageGridBlockContent
  | ListBlockContent
  | FAQBlockContent
  | SocialLinksBlockContent
  | ShareBlockContent
  | ProfileBlockContent
  | BusinessHoursBlockContent
  | ContactBlockContent
  | DividerBlockContent
  | FileBlockContent
  | { [key: string]: unknown }; // Fallback for custom blocks

// Block Interface
export interface Block {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  content: BlockContent;
  settings: {
    visible: boolean;
    order: number;
    customClasses: string[];
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    border?: string;
  };
  design: {
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
    padding: string;
    margin: string;
    border?: string;
    shadow?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Biolink Page Interface
export interface BiolinkPage {
  id: string;
  qrCodeId: string;
  title: string;
  slug: string;
  description?: string;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    backgroundImage?: string;
    fontFamily: string;
    fontSize: string;
    pattern?: string;
    customCss?: string;
  };
  seo: {
    title: string;
    description: string;
    image?: string;
    noIndex?: boolean;
  };
  blocks: Block[];
  settings: {
    showBranding: boolean;
    customDomain?: string;
    passwordProtected: boolean;
    password?: string;
    analyticsEnabled: boolean;
    trackingCode?: string;
  };
  stats: {
    views: number;
    uniqueViews: number;
    lastViewed?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Block Configuration for Registry
export interface BlockConfig {
  type: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: 'basic' | 'media' | 'content' | 'social' | 'business' | 'advanced';
  component: React.ComponentType<BlockEditorProps>;
  defaultData: BlockContent;
  defaultSettings: Block['settings'];
  defaultDesign: Block['design'];
  fieldDefinitions?: Array<{
    name: string;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
  }>;
}

// Block Editor Props
export interface BlockEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  isEditing?: boolean;
  isPreview?: boolean;
}
