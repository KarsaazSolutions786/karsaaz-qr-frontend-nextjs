// Biolink Entity Types

// Block Types
export type BlockType =
  | 'link'
  | 'text'
  | 'image'
  | 'title'
  | 'social-links'
  | 'video'
  | 'divider'
  | 'contact'
  | 'email'
  | 'phone'
  | 'location'
  | 'embed'
  | 'download'
  | 'payment'
  | 'newsletter'
  | 'faqs'
  | 'vcard'
  | 'lead-form'
  | 'opening-hours'
  | 'table'
  | 'list'
  | 'image-grid'
  | 'audio'
  | 'profile'

// Base Block Interface
export interface BlockBase {
  id: string
  type: BlockType
  order: number
}

// Specific Block Data Types
export interface LinkBlockData extends BlockBase {
  type: 'link'
  data: {
    url: string
    title: string
    icon?: string
    style?: 'button' | 'card' | 'minimal'
  }
}

export interface TextBlockData extends BlockBase {
  type: 'text'
  data: {
    content: string
    align?: 'left' | 'center' | 'right'
    size?: 'sm' | 'md' | 'lg'
  }
}

export interface ImageBlockData extends BlockBase {
  type: 'image'
  data: {
    url: string
    alt?: string
    link?: string
    caption?: string
  }
}

export interface TitleBlockData extends BlockBase {
  type: 'title'
  data: {
    text: string
    level?: 'h1' | 'h2' | 'h3'
    align?: 'left' | 'center' | 'right'
  }
}

export interface SocialLinksBlockData extends BlockBase {
  type: 'social-links'
  data: {
    links: Array<{
      platform: string
      url: string
      icon: string
    }>
  }
}

export interface VideoBlockData extends BlockBase {
  type: 'video'
  data: {
    url: string // YouTube or Vimeo URL
    title?: string
  }
}

export interface DividerBlockData extends BlockBase {
  type: 'divider'
  data: {
    style?: 'solid' | 'dashed' | 'dotted'
    color?: string
  }
}

export interface ContactBlockData extends BlockBase {
  type: 'contact'
  data: {
    name: string
    phone?: string
    email?: string
    address?: string
  }
}

export interface EmailBlockData extends BlockBase {
  type: 'email'
  data: {
    email: string
    subject?: string
    buttonText?: string
  }
}

export interface PhoneBlockData extends BlockBase {
  type: 'phone'
  data: {
    phone: string
    buttonText?: string
    showWhatsApp?: boolean
  }
}

export interface LocationBlockData extends BlockBase {
  type: 'location'
  data: {
    address: string
    coordinates?: { lat: number; lng: number }
    mapUrl?: string
  }
}

export interface EmbedBlockData extends BlockBase {
  type: 'embed'
  data: {
    embedCode: string
    height?: number
  }
}

export interface DownloadBlockData extends BlockBase {
  type: 'download'
  data: {
    fileName: string
    fileUrl: string
    fileSize?: string
    fileType?: string
  }
}

export interface PaymentBlockData extends BlockBase {
  type: 'payment'
  data: {
    amount: number
    currency: string
    description: string
    paymentUrl: string
  }
}

export interface NewsletterBlockData extends BlockBase {
  type: 'newsletter'
  data: {
    title: string
    description?: string
    placeholder?: string
    buttonText?: string
    apiEndpoint: string
  }
}

export interface FAQsBlockData extends BlockBase {
  type: 'faqs'
  data: {
    title?: string
    subtitle?: string
    faqs: Array<{ question: string; answer: string }>
  }
}

export interface VCardBlockData extends BlockBase {
  type: 'vcard'
  data: {
    firstName: string
    lastName?: string
    organization?: string
    phone?: string
    email?: string
    website?: string
    address?: string
    title?: string
    logo?: string
  }
}

export interface LeadFormBlockData extends BlockBase {
  type: 'lead-form'
  data: {
    title?: string
    fields: Array<{
      name: string
      label: string
      type: 'text' | 'email' | 'phone' | 'textarea'
      required?: boolean
    }>
    buttonText?: string
    apiEndpoint?: string
  }
}

export interface OpeningHoursBlockData extends BlockBase {
  type: 'opening-hours'
  data: {
    title?: string
    hours: Array<{
      day: string
      open: string
      close: string
      closed?: boolean
    }>
  }
}

export interface TableBlockData extends BlockBase {
  type: 'table'
  data: {
    tableData: string
    textColor?: string
  }
}

export interface ListBlockData extends BlockBase {
  type: 'list'
  data: {
    title?: string
    items: Array<{ text: string; icon?: string }>
  }
}

export interface ImageGridBlockData extends BlockBase {
  type: 'image-grid'
  data: {
    title?: string
    items: Array<{ url: string; alt?: string; link?: string }>
    gridGap?: number
  }
}

export interface AudioBlockData extends BlockBase {
  type: 'audio'
  data: {
    audioUrl: string
    title?: string
  }
}

export interface ProfileBlockData extends BlockBase {
  type: 'profile'
  data: {
    profileImage?: string
    backgroundImage?: string
    text?: string
    borderStyle?: 'circle' | 'default'
    size?: number
  }
}

// Union type of all blocks
export type BlockData =
  | LinkBlockData
  | TextBlockData
  | ImageBlockData
  | TitleBlockData
  | SocialLinksBlockData
  | VideoBlockData
  | DividerBlockData
  | ContactBlockData
  | EmailBlockData
  | PhoneBlockData
  | LocationBlockData
  | EmbedBlockData
  | DownloadBlockData
  | PaymentBlockData
  | NewsletterBlockData
  | FAQsBlockData
  | VCardBlockData
  | LeadFormBlockData
  | OpeningHoursBlockData
  | TableBlockData
  | ListBlockData
  | ImageGridBlockData
  | AudioBlockData
  | ProfileBlockData

// Biolink Theme
export interface BiolinkTheme {
  backgroundColor: string
  textColor: string
  buttonColor: string
  buttonTextColor: string
  fontFamily?: string
}

// Biolink Entity
export interface Biolink {
  id: number
  userId: number
  slug: string
  title: string
  description: string | null
  avatar?: string | null
  theme: BiolinkTheme
  blocks: BlockData[]
  isPublished: boolean
  views: number
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface BiolinksResponse {
  data: Biolink[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

// Create/Update DTOs
export interface CreateBiolinkRequest {
  slug: string
  title: string
  description?: string
  avatar?: string
  theme?: Partial<BiolinkTheme>
  blocks?: BlockData[]
  isPublished?: boolean
}

export interface UpdateBiolinkRequest extends Partial<CreateBiolinkRequest> {
  id: number
}

// Block Registry
export interface BlockDefinition {
  type: BlockType
  label: string
  icon: string
  category: 'core' | 'content' | 'social' | 'business'
  defaultData: any
}
